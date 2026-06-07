# TCCHackDefend2026_Codecrafters
# Perfinity
### Apprendre sans limites

Une plateforme éducative conçue pour offrir une expérience d'apprentissage moderne, accessible et personnalisée.

---

## À propos

Perfinity est une plateforme éducative nouvelle génération qui connecte apprenants et enseignants au sein d'un écosystème numérique simple et efficace.

Notre objectif est de démocratiser l'accès à une éducation de qualité grâce à des technologies modernes permettant un apprentissage interactif et flexible.

Nous croyons que chaque individu possède un potentiel infini. C'est pourquoi nous avons créé Perfinity.

---

## Notre mission

Rendre l'éducation plus accessible, plus efficace et plus engageante grâce au numérique.  
Perfinity accompagne les apprenants dans leur progression académique.

---

## Fonctionnalités principales

### Authentification & Gestion des utilisateurs
- Inscription et connexion sécurisée
- Création automatique du profil utilisateur via trigger PostgreSQL
- Gestion des rôles (étudiant par défaut)

### Interface utilisateur
- Pages d'accueil et d'authentification responsive
- Tableau de bord basique
- Design moderne et accessible

### Gestion des cours (en cours)
- Visualisation des cours
- Structure modulaire (partiellement implémentée)

---

## Fonctionnalités prévues (non implémentées par manque de temps)

- Système complet de progression et suivi des cours
- Espace enseignant (création et gestion de contenus)
- Quiz et évaluations interactives
- Certificats numériques
- Recommandations personnalisées
- Tuteur IA intégré
- Gamification
- Application mobile

---

## Technologies utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Design responsive, animations (Flexbox, Grid, Media Queries)
- **JavaScript (Vanilla)** : Logique client, gestion des formulaires, interactions avec Supabase

### Backend & Base de données
- **Supabase** (Backend as a Service) :
  - **PostgreSQL** comme base de données
  - **Supabase Auth** pour l'authentification et la gestion des sessions
  - **Triggers PostgreSQL** pour l'auto-création des profils (`handle_new_user`)
  - **Row Level Security (RLS)** pour la sécurité

### Outils de développement
- Git + GitHub

**Pourquoi ce stack ?**  
Stack légère, moderne et gratuite idéale pour un MVP étudiant. Supabase nous permet de gérer l'authentification, la base de données et la sécurité sans serveur backend dédié.

---

## Architecture du projet

```
perfinity/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── supabase/
│   └── client.js
└── README.md
```

**Composants principaux :**
- **Frontend** : Pages statiques + JS dynamique
- **Supabase** : Auth + Database + Triggers
- Synchronisation automatique entre `auth.users` et `public.utilisateurs`

---

## Types d'utilisateurs

### Apprenant
- Accéder aux cours
- Suivre sa progression (à venir)
- Gérer son profil

### Administrateur / Enseignant
- Fonctionnalités à développer

---

## Sécurité

- Authentification sécurisée via Supabase Auth (JWT)
- Row Level Security (RLS) sur les tables
- Triggers avec `SECURITY DEFINER`
- Pas de stockage du mot de passe en clair dans notre table `utilisateurs`

---

## Accessibilité

- Design responsive
- Structure HTML sémantique
- Compatibilité mobile

---

## Contribution

Les contributions sont les bienvenues. Pour toute amélioration, ouvrez une issue.

---

## Licence

Ce projet est actuellement propriétaire.  
Tous droits réservés © CodeCrafters - Perfinity 2026.
