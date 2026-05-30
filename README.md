# Jules Orchestrator

Application desktop permettant de piloter visuellement une flotte d'agents IA [Jules (Google)](https://jules.google.com/) qui travaillent de manière autonome sur des dépôts GitHub.

---

## Fonctionnalités

- Visualisation de vos dépôts GitHub et de leurs agents IA actifs
- Suivi des sessions Jules en cours (statut, tâche, branche)
- Consultation et gestion des Pull Requests ouvertes par les agents
- Acceptation / rejet de PRs directement depuis le tableau de bord
- Interface dark/light mode, esthétique terminal

---

## Stack technique

| Couche          | Technologie              |
|-----------------|--------------------------|
| Desktop Runtime | Electron 41              |
| Frontend        | React 19, React Router 7 |
| Langage         | TypeScript 6 (strict)    |
| Bundler         | Vite 8 + Tailwind CSS 4  |
| Data fetching   | TanStack React Query     |
| API GitHub      | Octokit REST             |
| API Jules       | HTTP client custom       |

---

## Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- Un **token GitHub** (Personal Access Token) avec les scopes `repo` et `read:user`
- Une **clé API Jules** — obtenir un accès sur [jules.google.com](https://jules.google.com/)

---

## Installation

**1. Cloner le dépôt**

```bash
git clone <url-du-repo>
cd jules-orchestrator
```

**2. Installer les dépendances**

Le projet contient deux `package.json` : un pour le processus Electron (racine) et un pour le renderer React (`src/renderer/`). Les deux doivent être installés.

```bash
# Dépendances Electron (racine)
npm clean-install

# Dépendances renderer (React + Vite)
npm clean-install --prefix src/renderer
```

**3. Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
JULES_API_KEY=xxxxxxxxxxxxxxxxxxxx
```

| Variable        | Description                                                 |
|-----------------|-------------------------------------------------------------|
| `GITHUB_TOKEN`  | Personal Access Token GitHub (scopes : `repo`, `read:user`) |
| `JULES_API_KEY` | Clé API Jules (Google)                                      |

> Le fichier `.env` est ignoré par git — ne pas le committer.

---

## Lancement

### Mode développement

Lance simultanément le serveur Vite, la compilation TypeScript en watch et Electron :

```bash
npm run dev
```

L'interface est disponible sur `http://localhost:5173`. Electron se lance automatiquement une fois le serveur prêt.

> Pour exposer le serveur Vite sur le réseau local : `npm run dev:host`

### Build de production

```bash
npm run build
```

Compile le renderer (Vite → `dist/renderer/`) et le processus principal (tsc + tsc-alias → `dist/electron/`).

### Packaging en exécutable

```bash
npm run dist
```

Génère un installateur natif (`.exe` sur Windows, `.dmg` sur macOS) dans le dossier `release/`.

---

## Architecture

```
src/
├── electron/           # Processus principal (Node.js / CommonJS)
│   ├── main.ts         # Création de la fenêtre Electron
│   ├── preload.ts      # Exposition de l'API via contextBridge
│   ├── controllers/    # GithubController, JulesController
│   └── utils/          # HttpClient, chargement des env vars
│
├── renderer/           # Application React (processus de rendu)
│   ├── components/     # Composants UI réutilisables
│   ├── config/         # Déclaration des routes
│   ├── context/        # ThemeContext (dark/light)
│   ├── data/           # Services GitHub et Jules (wrappent window.api)
│   ├── hooks/          # Hooks React Query pour Jules et GitHub
│   └── interfaces/     # Types TypeScript partagés côté renderer
│
└── shared/             # Types partagés entre main et renderer
    ├── jules/          # Interfaces Sessions, Sources
    └── github/         # Interfaces PR, Repository, Branch
```

Toute communication entre le renderer et le processus principal passe par `window.api`, exposé par le preload via `contextBridge`. Aucun module Electron n'est importé directement dans les composants React.

---

## Auteur

**Erwann Varlet** — Projet Desktop, Bachelor L3 Informatique, Ynov 2025-2026
