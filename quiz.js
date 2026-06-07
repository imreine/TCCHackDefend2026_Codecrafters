// Toutes les opérations liées aux quiz

import { supabase } from '/supabase.js'

// ── Liste tous les quiz publiés ──────────────────────────────
export async function getQuiz() {
  const { data, error } = await supabase
    .from('quiz')
    .select(`
      id,
      titre,
      description,
      niveau,
      duree_minutes,
      categories ( nom, icone )
    `)
    .eq('est_publie', true)
    .order('id')

  if (error) throw new Error(error.message)
  return data
}

// ── Détail d'un quiz avec questions et choix ─────────────────
// Les choix sont retournés SANS le flag est_correct (sécurité)
export async function getQuizDetail(quizId) {
  const { data: quiz, error: quizError } = await supabase
    .from('quiz')
    .select('id, titre, description, niveau, duree_minutes')
    .eq('id', quizId)
    .single()

  if (quizError) throw new Error('Quiz introuvable.')

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select(`
      id,
      enonce,
      ordre,
      choix ( id, texte, ordre )
    `)
    .eq('quiz_id', quizId)
    .order('ordre')

  if (qError) throw new Error(qError.message)

  return { ...quiz, questions }
}

// ── Démarrer une tentative ───────────────────────────────────
export async function demarrerTentative(utilisateurId, quizId) {
  // Compte le nombre de questions
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', quizId)

  const { data, error } = await supabase
    .from('tentatives_quiz')
    .insert({
      utilisateur_id:   utilisateurId,
      quiz_id:          quizId,
      total_questions:  count ?? 0
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data.id   // tentative_id
}

// ── Soumettre les réponses ───────────────────────────────────
// reponses = [{ question_id, choix_id }, ...]
export async function soumettreTentative(tentativeId, reponses) {
  // Récupère les bonnes réponses depuis la base
  const questionIds = reponses.map(r => r.question_id)
  const { data: bonnesReponses, error: brError } = await supabase
    .from('choix')
    .select('id, question_id, est_correct')
    .in('question_id', questionIds)

  if (brError) throw new Error(brError.message)

  // Calcule le score localement
  let score = 0
  const reponsesAInserer = reponses.map(rep => {
    const choixSelectionne = bonnesReponses.find(
      c => c.id === rep.choix_id && c.question_id === rep.question_id
    )
    const estCorrecte = choixSelectionne?.est_correct ?? false
    if (estCorrecte) score++

    return {
      tentative_id: tentativeId,
      question_id:  rep.question_id,
      choix_id:     rep.choix_id,
      est_correcte: estCorrecte
    }
  })

  // Insère les réponses
  const { error: rError } = await supabase
    .from('reponses_utilisateur')
    .insert(reponsesAInserer)

  if (rError) throw new Error(rError.message)

  // Met à jour le score et clôture la tentative
  const { data: tentative, error: tError } = await supabase
    .from('tentatives_quiz')
    .update({ score, fin_le: new Date().toISOString() })
    .eq('id', tentativeId)
    .select('score, total_questions')
    .single()

  if (tError) throw new Error(tError.message)

  const pct = tentative.total_questions > 0
    ? Math.round((score / tentative.total_questions) * 100)
    : 0

  return {
    score,
    total:       tentative.total_questions,
    pourcentage: pct,
    message:     pct >= 80 ? 'Excellent !' : pct >= 50 ? 'Pas mal !' : 'Continue à apprendre !'
  }
}

// ── Historique des tentatives d'un utilisateur ───────────────
export async function getHistoriqueQuiz(utilisateurId) {
  const { data, error } = await supabase
    .from('tentatives_quiz')
    .select(`
      id,
      score,
      total_questions,
      pourcentage,
      fin_le,
      quiz ( titre, categories ( nom, icone ) )
    `)
    .eq('utilisateur_id', utilisateurId)
    .not('fin_le', 'is', null)
    .order('fin_le', { ascending: false })
    .limit(10)

  if (error) throw new Error(error.message)
  return data
}