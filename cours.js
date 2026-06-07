// cours.js — page de détail d'un cours (ressources externes)
import { getCoursByid } from './coursService.js'
import { getSession }   from './authService.js'
import { mettreAJourNav } from './nav.js'

// ── Ressources externes par cours ───────────────────────────
const RESSOURCES = {
  1: { // Réseaux
    items: [
      { type: 'video',    source: 'YouTube',        titre: 'Le modèle OSI en 7 minutes',             desc: 'Explication claire et visuelle des 7 couches OSI.',                         url: 'https://www.youtube.com/results?search_query=modele+OSI+explication' },
      { type: 'cours',    source: 'OpenClassrooms',  titre: 'Fondamentaux des réseaux',               desc: 'Cours complet sur les réseaux informatiques pour débutants.',               url: 'https://openclassrooms.com/fr/courses/6944606-concevez-votre-reseau-tcp-ip' },
      { type: 'article',  source: 'Cisco',           titre: 'Introduction à TCP/IP',                  desc: 'Documentation officielle Cisco sur les protocoles réseau.',                 url: 'https://www.cisco.com/c/fr_fr/support/docs/ip/routing-information-protocol-rip/13769-5.html' },
      { type: 'pratique', source: 'Packet Tracer',   titre: 'Simulateur réseau gratuit',              desc: 'Pratique la configuration réseau avec l\'outil officiel Cisco.',            url: 'https://www.netacad.com/courses/packet-tracer' },
      { type: 'cours',    source: 'freeCodeCamp',    titre: 'Computer Networking Full Course',        desc: 'Cours complet sur les réseaux (en anglais, sous-titres disponibles).',     url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
    ]
  },
  2: { // Web
    items: [
      { type: 'cours',    source: 'freeCodeCamp',    titre: 'HTML & CSS for Beginners',               desc: 'Cours complet HTML/CSS avec exercices pratiques intégrés.',                url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
      { type: 'article',  source: 'MDN Web Docs',    titre: 'Documentation HTML officielle',          desc: 'La référence ultime pour HTML, CSS et JavaScript par Mozilla.',            url: 'https://developer.mozilla.org/fr/docs/Web/HTML' },
      { type: 'video',    source: 'YouTube',         titre: 'Apprendre le CSS Flexbox',               desc: 'Tutoriel complet sur Flexbox en français.',                                url: 'https://www.youtube.com/results?search_query=flexbox+css+tutoriel+francais' },
      { type: 'pratique', source: 'W3Schools',       titre: 'Exercices interactifs HTML/CSS/JS',      desc: 'Pratique directement dans le navigateur sans installation.',               url: 'https://www.w3schools.com/html/html_exercises.asp' },
      { type: 'cours',    source: 'OpenClassrooms',  titre: 'Créez votre site web avec HTML5 et CSS3',desc: 'Le cours français de référence pour débuter le développement web.',         url: 'https://openclassrooms.com/fr/courses/1603881-creez-votre-site-web-avec-html5-et-css3' },
    ]
  },
  3: { // Algorithmes
    items: [
      { type: 'cours',    source: 'freeCodeCamp',    titre: 'Algorithms and Data Structures',         desc: 'Cours complet sur les structures de données et algorithmes.',               url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
      { type: 'video',    source: 'YouTube',         titre: 'Algorithmes de tri expliqués',           desc: 'Visualisation animée des principaux algorithmes de tri.',                  url: 'https://www.youtube.com/results?search_query=algorithmes+tri+visualisation+francais' },
      { type: 'pratique', source: 'LeetCode',        titre: 'Exercices d\'algorithmique',             desc: 'Plateforme d\'entraînement aux algorithmes avec problèmes classiques.',    url: 'https://leetcode.com/problemset/' },
      { type: 'article',  source: 'GeeksForGeeks',   titre: 'Data Structures Tutorials',              desc: 'Articles détaillés sur toutes les structures de données.',                 url: 'https://www.geeksforgeeks.org/data-structures/' },
      { type: 'pratique', source: 'VisuAlgo',        titre: 'Visualisation d\'algorithmes',           desc: 'Animations interactives pour comprendre le fonctionnement des algos.',    url: 'https://visualgo.net/fr' },
    ]
  },
  4: { // Cybersécurité
    items: [
      { type: 'cours',    source: 'OpenClassrooms',  titre: 'Sécurisez vos données avec la crypto',  desc: 'Introduction à la cryptographie et à la sécurité des données.',           url: 'https://openclassrooms.com/fr/courses/1757741-securisez-vos-donnees-avec-la-cryptographie' },
      { type: 'video',    source: 'YouTube',         titre: 'Cybersécurité pour débutants',           desc: 'Comprendre les attaques courantes et comment s\'en protéger.',             url: 'https://www.youtube.com/results?search_query=cybersecurite+debutant+francais' },
      { type: 'cours',    source: 'Cybrary',         titre: 'Introduction to IT & Cybersecurity',     desc: 'Cours gratuit de cybersécurité reconnu dans l\'industrie.',                url: 'https://www.cybrary.it/course/intro-to-it-and-cybersecurity/' },
      { type: 'pratique', source: 'TryHackMe',       titre: 'Apprendre la sécurité en pratique',     desc: 'Plateforme gamifiée pour apprendre la cybersécurité par la pratique.',    url: 'https://tryhackme.com/' },
      { type: 'article',  source: 'ANSSI',           titre: 'Guide de la sécurité numérique',        desc: 'Recommandations officielles de l\'agence française de cybersécurité.',    url: 'https://www.ssi.gouv.fr/particulier/' },
    ]
  },
  5: { // IA
    items: [
      { type: 'cours',    source: 'Google',          titre: 'Machine Learning Crash Course',          desc: 'Le cours d\'initiation au ML de Google, gratuit et interactif.',           url: 'https://developers.google.com/machine-learning/crash-course' },
      { type: 'video',    source: 'YouTube',         titre: 'L\'intelligence artificielle expliquée', desc: 'Introduction claire au ML et aux réseaux de neurones en français.',        url: 'https://www.youtube.com/results?search_query=intelligence+artificielle+machine+learning+francais' },
      { type: 'cours',    source: 'Coursera',        titre: 'AI For Everyone – Andrew Ng',            desc: 'Cours non-technique pour comprendre l\'IA (avec sous-titres FR).',         url: 'https://www.coursera.org/learn/ai-for-everyone' },
      { type: 'pratique', source: 'Kaggle',          titre: 'Intro to Machine Learning',              desc: 'Apprentissage pratique du ML avec des datasets réels.',                   url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
      { type: 'article',  source: 'OpenClassrooms',  titre: 'Initiez-vous au Machine Learning',       desc: 'Cours en français pour comprendre les bases du machine learning.',         url: 'https://openclassrooms.com/fr/courses/4011851-initiez-vous-au-machine-learning' },
    ]
  },
  6: { // SQL
    items: [
      { type: 'cours',    source: 'SQLZoo',          titre: 'Apprendre SQL interactivement',          desc: 'Tutoriels SQL interactifs directement dans le navigateur.',               url: 'https://sqlzoo.net/wiki/SQL_Tutorial' },
      { type: 'video',    source: 'YouTube',         titre: 'SQL pour débutants — cours complet',     desc: 'Apprendre les bases de SQL en français de zéro.',                         url: 'https://www.youtube.com/results?search_query=sql+debutant+cours+complet+francais' },
      { type: 'cours',    source: 'OpenClassrooms',  titre: 'Administrez vos bases de données',       desc: 'Cours complet sur SQL et la gestion de bases de données.',                url: 'https://openclassrooms.com/fr/courses/6971126-administrez-vos-bases-de-donnees-avec-mysql' },
      { type: 'pratique', source: 'W3Schools',       titre: 'SQL Try It — exercices en ligne',        desc: 'Pratique SQL sans installation dans un éditeur en ligne.',                url: 'https://www.w3schools.com/sql/sql_exercises.asp' },
      { type: 'article',  source: 'PostgreSQL',      titre: 'Documentation officielle PostgreSQL',    desc: 'La référence complète de PostgreSQL, la base utilisée par Perfinity.',    url: 'https://www.postgresql.org/docs/' },
    ]
  },
}

const TYPE_LABELS = {
  video:    { label: '🎥 Vidéo',    css: 'type-video'    },
  article:  { label: '📖 Article',  css: 'type-article'  },
  cours:    { label: '📚 Cours',    css: 'type-cours'    },
  pratique: { label: '⚙️ Pratique', css: 'type-pratique' },
}

async function init() {
  const params  = new URLSearchParams(window.location.search)
  const coursId = parseInt(params.get('id'))

  // Met à jour la navbar selon la session
  await mettreAJourNav()

  if (!coursId) {
    afficherErreur('Aucun cours sélectionné.')
    return
  }

  try {
    const cours = await getCoursByid(coursId)
    document.title = `Perfinity – ${cours.titre}`
    afficherPage(cours, coursId)
  } catch (err) {
    afficherErreur('Cours introuvable.')
  }
}

function afficherPage(cours, coursId) {
  const ressources = RESSOURCES[coursId]?.items ?? []
  const niveauLabel = {
    debutant: '🟢 Débutant',
    intermediaire: '🟡 Intermédiaire',
    avance: '🔴 Avancé'
  }

  // Groupe les ressources par type
  const videos    = ressources.filter(r => r.type === 'video')
  const coursList = ressources.filter(r => r.type === 'cours')
  const articles  = ressources.filter(r => r.type === 'article')
  const pratiques = ressources.filter(r => r.type === 'pratique')

  document.getElementById('mainContent').innerHTML = `

    <div class="cours-hero">
      <div class="cours-hero-inner">
        <div class="breadcrumb">
          <a href="cata.html">Catalogue</a>
          <span>›</span>
          <span>${cours.categories?.nom ?? 'Cours'}</span>
          <span>›</span>
          <span>${cours.titre}</span>
        </div>
        <div class="cours-tag-hero">
          ${cours.categories?.icone ?? '📚'} ${cours.categories?.nom ?? 'Général'}
        </div>
        <h1>${cours.titre}</h1>
        <p>${cours.description ?? ''}</p>
        <div class="meta-row">
          <span class="meta-badge">🕐 ${formatDuree(cours.duree_minutes)}</span>
          <span class="meta-badge">${niveauLabel[cours.niveau] ?? cours.niveau}</span>
          <span class="meta-badge">🔗 ${ressources.length} ressources sélectionnées</span>
        </div>
      </div>
    </div>

    <div class="ressources-section">

      ${videos.length > 0 ? `
        <h2>🎥 Vidéos recommandées</h2>
        <div class="ressources-grid">${videos.map(carteRessource).join('')}</div>
      ` : ''}

      ${coursList.length > 0 ? `
        <h2>📚 Cours en ligne</h2>
        <div class="ressources-grid">${coursList.map(carteRessource).join('')}</div>
      ` : ''}

      ${articles.length > 0 ? `
        <h2>📖 Articles & documentation</h2>
        <div class="ressources-grid">${articles.map(carteRessource).join('')}</div>
      ` : ''}

      ${pratiques.length > 0 ? `
        <h2>⚙️ Mise en pratique</h2>
        <div class="ressources-grid">${pratiques.map(carteRessource).join('')}</div>
      ` : ''}

      <!-- CTA Quiz -->
      <div class="quiz-cta">
        <div>
          <h3>🧠 Prêt·e à tester tes connaissances ?</h3>
          <p>Après avoir exploré les ressources, fais le quiz pour valider ta compréhension.</p>
        </div>
        <a href="qui.html" class="btn btn-primary">Faire le quiz →</a>
      </div>

    </div>

    <div class="nav-bottom">
      <a href="cata.html" class="btn btn-outline">← Retour au catalogue</a>
      <a href="tdb.html"  class="btn btn-primary">Mon tableau de bord</a>
    </div>
  `
}

function carteRessource(r) {
  const t = TYPE_LABELS[r.type] ?? { label: r.type, css: '' }
  return `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="ressource-card">
      <div class="ressource-top">
        <span class="ressource-type ${t.css}">${t.label}</span>
        <span class="ressource-source">${r.source}</span>
      </div>
      <h4>${r.titre}</h4>
      <p>${r.desc}</p>
      <span class="ressource-link">Accéder à la ressource →</span>
    </a>
  `
}

function afficherErreur(msg) {
  document.getElementById('mainContent').innerHTML = `
    <div style="text-align:center;padding:5rem 2rem;color:var(--text-light)">
      <p style="font-size:3rem;margin-bottom:1rem">😕</p>
      <p style="font-size:1.1rem;margin-bottom:1.5rem">${msg}</p>
      <a href="cata.html" class="btn btn-primary">Retour au catalogue</a>
    </div>
  `
}

function formatDuree(minutes) {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}`.trim() : `${m}min`
}

init()