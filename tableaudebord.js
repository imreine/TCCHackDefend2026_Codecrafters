// Statistiques et progression pour le tableau de bord

import { supabase } from '/supabase.js'

// ── Stats globales de l'utilisateur ─────────────────────────
export async function getStats(utilisateurId) {
  // Cours inscrits et terminés
  const { data: inscriptions, error: iError } = await supabase
    .from('inscriptions_cours')
    .select('est_termine')
    .eq('utilisateur_id', utilisateurId)

  if (iError) throw new Error(iError.message)

  const coursInscrits  = inscriptions.length
  const coursTermines  = inscriptions.filter(i => i.est_termine).length

  // Quiz complétés + score moyen
  const { data: tentatives, error: tError } = await supabase
    .from('tentatives_quiz')
    .select('pourcentage')
    .eq('utilisateur_id', utilisateurId)
    .not('fin_le', 'is', null)

  if (tError) throw new Error(tError.message)

  const quizCompletes = tentatives.length
  const scoreMoyen = quizCompletes > 0
    ? Math.round(tentatives.reduce((acc, t) => acc + Number(t.pourcentage), 0) / quizCompletes)
    : 0

  // Streak — jours consécutifs d'activité
  const streak = await calculerStreak(utilisateurId)

  return {
    cours_inscrits:     coursInscrits,
    cours_termines:     coursTermines,
    quiz_completes:     quizCompletes,
    score_moyen:        scoreMoyen,
    jours_consecutifs:  streak
  }
}

// ── Progression détaillée par cours ─────────────────────────
export async function getProgression(utilisateurId) {
  const { data, error } = await supabase
    .from('inscriptions_cours')
    .select(`
      progression,
      est_termine,
      inscrit_le,
      cours (
        id,
        titre,
        categories ( nom, icone )
      )
    `)
    .eq('utilisateur_id', utilisateurId)
    .order('progression', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ── Activité récente (quiz + cours mélangés) ─────────────────
export async function getActiviteRecente(utilisateurId) {
  const [{ data: quiz }, { data: cours }] = await Promise.all([
    supabase
      .from('tentatives_quiz')
      .select('fin_le, pourcentage, quiz ( titre )')
      .eq('utilisateur_id', utilisateurId)
      .not('fin_le', 'is', null)
      .order('fin_le', { ascending: false })
      .limit(5),

    supabase
      .from('inscriptions_cours')
      .select('mis_a_jour_le, progression, est_termine, cours ( titre )')
      .eq('utilisateur_id', utilisateurId)
      .order('mis_a_jour_le', { ascending: false })
      .limit(5)
  ])

  const activites = [
    ...(quiz  ?? []).map(q => ({
      type:  'quiz',
      titre: q.quiz?.titre,
      info:  `${q.pourcentage}%`,
      date:  q.fin_le
    })),
    ...(cours ?? []).map(c => ({
      type:  c.est_termine ? 'cours_termine' : 'cours_progression',
      titre: c.cours?.titre,
      info:  `${c.progression}%`,
      date:  c.mis_a_jour_le
    }))
  ]

  // Trie par date décroissante et garde les 8 plus récentes
  activites.sort((a, b) => new Date(b.date) - new Date(a.date))
  return activites.slice(0, 8)
}

// ── Calcul du streak (jours consécutifs) ─────────────────────
async function calculerStreak(utilisateurId) {
  const { data } = await supabase
    .from('tentatives_quiz')
    .select('fin_le')
    .eq('utilisateur_id', utilisateurId)
    .not('fin_le', 'is', null)
    .order('fin_le', { ascending: false })

  if (!data || data.length === 0) return 0

  // Extrait les dates uniques (format YYYY-MM-DD)
  const joursUniques = [...new Set(
    data.map(t => t.fin_le.slice(0, 10))
  )].sort((a, b) => new Date(b) - new Date(a))

  let streak = 0
  let dateRef = new Date()
  dateRef.setHours(0, 0, 0, 0)

  for (const jour of joursUniques) {
    const d = new Date(jour)
    const diff = Math.round((dateRef - d) / (1000 * 60 * 60 * 24))
    if (diff <= 1) {
      streak++
      dateRef = d
    } else {
      break
    }
  }

  return streak
}