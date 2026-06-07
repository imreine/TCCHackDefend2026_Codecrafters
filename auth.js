// Gère toute l'authentification via Supabase Auth

import { supabase } from '../lib/supabaseClient'

// ── Inscription ──────────────────────────────────────────────
// Crée un compte Auth Supabase ET insère dans notre table utilisateurs
export async function inscrire({ prenom, nom, email, motDePasse }) {
  // 1. Crée le compte dans Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password: motDePasse,
    options: {
      data: { prenom, nom }   // metadata stockée dans auth.users
    }
  })

  if (error) throw new Error(error.message)

  // 2. Insère aussi dans notre table utilisateurs (pour la progression, etc.)
  if (data.user) {
    const { error: dbError } = await supabase
      .from('utilisateurs')
      .insert({
        id:     data.user.id,   // même UUID que Supabase Auth
        prenom,
        nom,
        email,
        mot_de_passe: 'gere_par_supabase_auth'  // placeholder — le vrai hash est dans auth.users
      })

    if (dbError) throw new Error(dbError.message)
  }

  return data
}

// ── Connexion ────────────────────────────────────────────────
export async function connecter({ email, motDePasse }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasse
  })

  if (error) throw new Error('Email ou mot de passe incorrect.')
  return data   // { user, session }
}

// ── Déconnexion ──────────────────────────────────────────────
export async function deconnecter() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

// ── Session courante ─────────────────────────────────────────
// Retourne l'utilisateur connecté, ou null
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUtilisateurCourant() {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

// ── Écouter les changements de session (pour React) ──────────
// Utilise ceci dans un useEffect au niveau App.jsx
export function ecouterAuth(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return listener   // appelle listener.subscription.unsubscribe() au cleanup
}