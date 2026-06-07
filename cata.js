// cata.js
import { getCours }        from './coursService.js'
import { getSession }      from './authService.js'
import { mettreAJourNav }  from './nav.js'

async function init() {
  await mettreAJourNav()

  const grid = document.querySelector('.courses-grid')
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light);">Chargement...</div>`

  try {
    const cours = await getCours()
    if (!cours.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light);">Aucun cours disponible.</div>`
      return
    }
    grid.innerHTML = cours.map(c => `
      <div class="course-card" onclick="window.location.href='cours.html?id=${c.id}'" style="cursor:pointer">
        <div class="course-thumb">${c.categories?.icone ?? '📚'}</div>
        <div class="course-body">
          <span class="course-tag">${c.categories?.nom ?? 'Général'}</span>
          <h3>${c.titre}</h3>
          <p>${c.description ?? ''}</p>
          <div class="course-footer">
            <span>🕐 ${formatDuree(c.duree_minutes)}</span>
            <a href="cours.html?id=${c.id}" class="btn btn-primary" style="padding:.4rem 1.1rem;font-size:.82rem;">Commencer</a>
          </div>
        </div>
      </div>
    `).join('')
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#dc2626;">Erreur : ${err.message}</div>`
  }
}

function formatDuree(m) {
  if (!m) return 'N/A'
  const h = Math.floor(m / 60), min = m % 60
  return h > 0 ? `${h}h ${min > 0 ? min + 'min' : ''}`.trim() : `${min}min`
}

init()