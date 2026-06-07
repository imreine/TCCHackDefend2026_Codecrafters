// Point d'entrée unique vers Supabase — importe ce fichier partout où tu en as besoin

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error('Variables REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY manquantes dans .env.local')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)