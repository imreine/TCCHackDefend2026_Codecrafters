// qui.js
import { getQuiz, getQuizDetail, demarrerTentative, soumettreTentative } from './quizService.js'
import { getSession }      from './authService.js'
import { mettreAJourNav }  from './nav.js'

let session = null, tentativeId = null, currentQuiz = null, currentQ = 0, reponses = []

async function init() {
  await mettreAJourNav()
  session = await getSession()

  const list = document.querySelector('.quiz-list')
  list.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-light);">Chargement...</div>`

  try {
    const quiz = await getQuiz()
    list.innerHTML = quiz.map(q => `
      <div class="quiz-item" onclick="ouvrirQuiz(${q.id})">
        <div class="quiz-item-icon">${q.categories?.icone ?? '📝'}</div>
        <div class="quiz-item-content">
          <h4>${q.titre}</h4>
          <p>${q.description ?? ''}</p>
          <div class="quiz-meta">
            <span>${q.duree_minutes ?? 5} min</span>
            <span>${q.niveau}</span>
          </div>
        </div>
      </div>
    `).join('')
  } catch (err) {
    list.innerHTML = `<p style="color:#dc2626">Erreur : ${err.message}</p>`
  }
}

window.ouvrirQuiz = async function(quizId) {
  if (!session) { window.location.href = 'log.html'; return }
  try {
    const overlay = document.getElementById('quizOverlay')
    const content = document.getElementById('quizContent')
    content.innerHTML = '<p style="text-align:center;padding:2rem">Chargement...</p>'
    overlay.classList.add('open')
    const [quizDetail, tid] = await Promise.all([getQuizDetail(quizId), demarrerTentative(session.user.id, quizId)])
    currentQuiz = quizDetail; tentativeId = tid; currentQ = 0; reponses = []
    afficherQuestion()
  } catch (err) { alert('Erreur : ' + err.message); fermerQuiz() }
}

function afficherQuestion() {
  const q = currentQuiz.questions[currentQ], total = currentQuiz.questions.length
  document.getElementById('quizContent').innerHTML = `
    <h2>${currentQuiz.titre}</h2>
    <p style="font-size:.82rem;color:var(--text-light);font-family:var(--font-ui);font-weight:600;margin-bottom:.3rem">Question ${currentQ+1} / ${total}</p>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${Math.round(currentQ/total*100)}%"></div></div>
    <p class="question-text">${q.enonce}</p>
    <div class="choices">${q.choix.map(c => `<button class="choice-btn" id="choix-${c.id}" onclick="selectionnerChoix(${q.id},${c.id})">${c.texte}</button>`).join('')}</div>
    <div class="quiz-nav">
      <button class="btn btn-primary" id="nextBtn" onclick="questionSuivante()" disabled style="opacity:.4;cursor:not-allowed">
        ${currentQ+1 < total ? 'Suivant →' : 'Voir le résultat'}
      </button>
    </div>
  `
}

window.selectionnerChoix = function(qid, cid) {
  if (reponses.find(r => r.question_id === qid)) return
  reponses.push({ question_id: qid, choix_id: cid })
  document.querySelectorAll('.choice-btn').forEach(b => { if (b.id === `choix-${cid}`) b.classList.add('selected') })
  const btn = document.getElementById('nextBtn')
  btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer'
}

window.questionSuivante = async function() {
  currentQ++
  if (currentQ >= currentQuiz.questions.length) await afficherResultat()
  else afficherQuestion()
}

async function afficherResultat() {
  document.getElementById('quizContent').innerHTML = '<p style="text-align:center;padding:2rem">Calcul du score...</p>'
  try {
    const r = await soumettreTentative(tentativeId, reponses)
    document.getElementById('quizContent').innerHTML = `
      <div class="quiz-result">
        <div class="score">${r.score}/${r.total}</div>
        <p style="font-size:1.5rem;margin-bottom:.5rem">${r.pourcentage>=80?'🎉':r.pourcentage>=50?'👍':'📚'} ${r.message}</p>
        <p>Tu as obtenu <strong>${r.pourcentage}%</strong> de bonnes réponses.</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem">
          <button class="btn btn-primary" onclick="ouvrirQuiz(${currentQuiz.id})">Recommencer</button>
          <button class="btn btn-outline" onclick="fermerQuiz()">Retour aux quiz</button>
        </div>
      </div>`
  } catch (err) { document.getElementById('quizContent').innerHTML = `<p style="color:#dc2626;text-align:center">Erreur : ${err.message}</p>` }
}

window.fermerQuiz = function() { document.getElementById('quizOverlay').classList.remove('open') }

init()