// nav.js — gestion dynamique de la navbar
// À importer dans TOUS les fichiers JS de page
import { getSession, deconnecter } from './authService.js'

export async function mettreAJourNav() {
  const session = await getSession()

  const navInscrip = document.getElementById('nav-inscrip')
  const navAuth    = document.getElementById('nav-auth')

  if (!navInscrip || !navAuth) return

  if (session) {
    const user   = session.user
    const prenom = user.user_metadata?.prenom ?? user.email?.split('@')[0] ?? 'Moi'
    const initiale = prenom.charAt(0).toUpperCase()

    // Cache "Inscription"
    navInscrip.parentElement.style.display = 'none'

    // Remplace "Connexion" par un avatar + menu déroulant
    navAuth.parentElement.innerHTML = `
      <div class="nav-profil" id="navProfil">
        <button class="avatar-btn" id="avatarBtn" aria-label="Menu profil">
          <span class="avatar-initiale">${initiale}</span>
          <span class="avatar-prenom">${prenom}</span>
          <span class="avatar-chevron">▾</span>
        </button>
        <div class="profil-dropdown" id="profilDropdown">
          <div class="dropdown-header">
            <span class="dropdown-nom">${prenom}</span>
            <span class="dropdown-email">${user.email}</span>
          </div>
          <a href="tdb.html" class="dropdown-item">📊 Tableau de bord</a>
          <a href="profil.html" class="dropdown-item">👤 Mon profil</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item dropdown-deconnexion" id="btnDeco">
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    `

    // Toggle dropdown
    document.getElementById('avatarBtn').addEventListener('click', (e) => {
      e.stopPropagation()
      document.getElementById('profilDropdown').classList.toggle('open')
    })

    // Ferme si clic ailleurs
    document.addEventListener('click', () => {
      document.getElementById('profilDropdown')?.classList.remove('open')
    })

    // Déconnexion
    document.getElementById('btnDeco').addEventListener('click', async () => {
      await deconnecter()
      window.location.href = 'index.html'
    })

  } else {
    // Non connecté — affichage normal
    navInscrip.parentElement.style.display = ''
    navAuth.textContent = 'Connexion'
    navAuth.href        = 'log.html'
  }
}