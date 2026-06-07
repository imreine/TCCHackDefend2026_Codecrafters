// tdb.js
import { getSession, deconnecter }                     from './authService.js'
import { getStats, getProgression, getActiviteRecente } from './dashboardService.js'
import { mettreAJourNav }                               from './nav.js'

async function init() {
  await mettreAJourNav()
  const session = await getSession()
  if (!session) { window.location.href = 'log.html'; return }

  const user = session.user, meta = user.user_metadata
  const welcomeH2 = document.querySelector('.dashboard-welcome h2')
  if (welcomeH2 && meta?.prenom) welcomeH2.textContent = `Bonjour, ${meta.prenom} 👋`

  try {
    const [stats, progression, activites] = await Promise.all([getStats(user.id), getProgression(user.id), getActiviteRecente(user.id)])
    afficherStats(stats)
    afficherProgression(progression)
    afficherActivites(activites)
  } catch (err) { console.error(err.message) }
}

function afficherStats(s) {
  const map = {
    '.stat-cours-inscrits': s.cours_inscrits,
    '.stat-cours-termines': s.cours_termines,
    '.stat-quiz-completes': s.quiz_completes,
    '.stat-score-moyen':    s.score_moyen + '%',
    '.stat-streak':         s.jours_consecutifs,
  }
  Object.entries(map).forEach(([sel, val]) => { const el = document.querySelector(sel); if (el) el.textContent = val })
}

function afficherProgression(progression) {
  const container = document.querySelector('.progress-items')
  if (!container) return
  if (!progression.length) { container.innerHTML = `<p style="color:var(--text-light);font-size:.9rem">Pas encore inscrit à un cours. <a href="cata.html" style="color:var(--primary);font-weight:700">Explorer →</a></p>`; return }
  container.innerHTML = progression.map(p => `
    <div class="progress-item">
      <div class="progress-header">
        <span>${p.cours?.categories?.icone ?? '📚'} ${p.cours?.titre ?? 'Cours'}</span>
        <span>${p.progression}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${p.progression}%"></div></div>
    </div>`).join('')
}

function afficherActivites(activites) {
  const container = document.querySelector('.activity-items')
  if (!container) return
  if (!activites.length) { container.innerHTML = `<p style="color:var(--text-light);font-size:.9rem">Aucune activité pour l'instant.</p>`; return }
  container.innerHTML = activites.map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.type==='cours_termine'?'var(--accent)':'var(--primary)'}"></div>
      <div class="activity-text">${a.type==='quiz'?'🧠 ':a.type==='cours_termine'?'✅ ':'📚 '}${a.titre}${a.info?` <span style="color:var(--primary);font-weight:700">· ${a.info}</span>`:''}</div>
      <div class="activity-time">${formatDate(a.date)}</div>
    </div>`).join('')
}

function formatDate(d) {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000)
  return diff === 0 ? 'Auj.' : diff === 1 ? 'Hier' : `Il y a ${diff}j`
}

init()