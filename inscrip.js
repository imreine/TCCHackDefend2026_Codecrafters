// inscrip.js
import { inscrire, getSession } from './authService.js'
import { mettreAJourNav }       from './nav.js'

async function init() {
  await mettreAJourNav()
  const session = await getSession()
  if (session) { window.location.href = 'tdb.html'; return }

  const form = document.querySelector('form'), errorMsg = document.getElementById('errorMsg'), successMsg = document.getElementById('successMsg')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorMsg.style.display = successMsg.style.display = 'none'
    const prenom = document.getElementById('prenom').value.trim()
    const nom = document.getElementById('nom').value.trim()
    const email = document.getElementById('email').value.trim()
    const motDePasse = document.getElementById('mdp').value
    const motDePasse2 = document.getElementById('mdp2').value
    if (!prenom || !nom || !email || !motDePasse) { afficherErreur('Remplis tous les champs.'); return }
    if (motDePasse !== motDePasse2) { afficherErreur('Les mots de passe ne correspondent pas.'); return }
    if (motDePasse.length < 8) { afficherErreur('Mot de passe trop court (8 caractères min).'); return }
    const btn = form.querySelector('button[type="submit"]')
    btn.disabled = true; btn.textContent = 'Création du compte...'
    try {
      await inscrire({ prenom, nom, email, motDePasse })
      successMsg.textContent = '✅ Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.'
      successMsg.style.display = 'block'
      form.reset()
      setTimeout(() => window.location.href = 'log.html', 3000)
    } catch (err) { afficherErreur(err.message); btn.disabled = false; btn.textContent = "S'inscrire" }
  })
  function afficherErreur(msg) { errorMsg.textContent = msg; errorMsg.style.display = 'block' }
}
init()