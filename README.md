# Jules Orchestrator

Application desktop permettant de piloter visuellement une flotte d'agents IA [Jules (Google)](https://jules.google.com/) qui travaillent de manière autonome sur des dépôts GitHub.

---

## Fonctionnalités

- Visualisation de vos dépôts GitHub et de leurs agents IA actifs
- Suivi des sessions Jules en cours (statut, tâche, branche)
- Consultation des Pull Requests vos dépôts (ouvertes par les agents ou non)
- Interface dark/light mode, esthétique terminal

---

## Prérequis

- **Node.js** 22
- **npm** ≥ 10

---

## Installation

**1. Cloner le dépôt**

```bash
git clone https://github.com/erwnn20/jules-orchestrator.git
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

Copier le fichier `.env.example` dans un nouveau fichier `.env`.
Puis compléter les variables d'environnement en suivant les instructions depuis ce fichier.

```bash
cp .env.example .env
```

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
npm run generate
```

Génère un installateur natif (`.exe` sur Windows, `.dmg` sur macOS) dans le dossier `release/`.

> Un raccourci du `.exe` sera automatiquement généré à la racine du projet.

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
