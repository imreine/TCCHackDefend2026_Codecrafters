// log.js
import { connecter, getSession } from './authService.js'
import { mettreAJourNav }        from './nav.js'

async function init() {
  await mettreAJourNav()
  const session = await getSession()
  if (session) { window.location.href = 'tdb.html'; return }

  const form = document.querySelector('form'), errorMsg = document.getElementById('errorMsg'), successMsg = document.getElementById('successMsg')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorMsg.style.display = successMsg.style.display = 'none'
    const email = document.getElementById('email').value.trim()
    const motDePasse = document.getElementById('mdp').value
    if (!email || !motDePasse) { afficherErreur('Remplis tous les champs.'); return }
    const btn = form.querySelector('button[type="submit"]')
    btn.disabled = true; btn.textContent = 'Connexion en cours...'
    try {
      await connecter({ email, motDePasse })
      successMsg.textContent = '✅ Connexion réussie ! Redirection...'
      successMsg.style.display = 'block'
      setTimeout(() => window.location.href = 'tdb.html', 1500)
    } catch (err) { afficherErreur(err.message); btn.disabled = false; btn.textContent = 'Se connecter' }
  })
  function afficherErreur(msg) { errorMsg.textContent = msg; errorMsg.style.display = 'block' }
}
init()