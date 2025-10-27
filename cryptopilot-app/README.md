# 🚀 CryptoPilot

[English](#english) | [Français](#français)

---

## Français

### 📋 Description

Application React moderne pour gérer et suivre vos cryptomonnaies. Interface intuitive, performante et prête à l'emploi.

### ✨ Fonctionnalités

- ⚛️ Interface React moderne
- 🗺️ Navigation avec React Router
- 📊 Gestion d'état (Context API)
- 🔌 Intégration API crypto en temps réel
- ✅ Tests unitaires inclus

### 📦 Prérequis

- Node.js 16 ou supérieur
- npm ou yarn

### 🛠️ Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd cryptopilot-app

# 2. Installer les dépendances
npm install
# ou
yarn
```

### 🚀 Démarrage rapide

```bash
# Développement
npm start

# L'application sera disponible sur http://localhost:3000
```

### 📦 Build de production

```bash
npm run build
```

Le dossier `build/` contiendra votre application optimisée.

### 🧪 Tests et Qualité

```bash
# Lancer les tests
npm test

# Vérifier le code (linting)
npm run lint
```

### ⚙️ Configuration

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=votre_clé_api
```

### 📁 Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/          # Pages de l'application
├── hooks/          # Hooks personnalisés
├── services/       # Services API
├── context/        # Context API pour l'état global
├── assets/         # Images, fonts, etc.
├── styles/         # Styles globaux
├── App.jsx         # Composant principal
└── index.jsx       # Point d'entrée
```

### 🌐 Déploiement

Déployez facilement sur :
- **Netlify** : Glissez-déposez le dossier `build/`
- **Vercel** : Connectez votre repo GitHub
- **GitHub Pages** : Utilisez `gh-pages` package

N'oubliez pas de configurer vos variables d'environnement sur votre plateforme d'hébergement.

### 🤝 Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

### 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## English

### 📋 Description

Modern React application to manage and track your cryptocurrencies. Intuitive, performant, and ready-to-use interface.

### ✨ Features

- ⚛️ Modern React interface
- 🗺️ Navigation with React Router
- 📊 State management (Context API)
- 🔌 Real-time crypto API integration
- ✅ Unit tests included

### 📦 Prerequisites

- Node.js 16 or higher
- npm or yarn

### 🛠️ Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd cryptopilot-app

# 2. Install dependencies
npm install
# or
yarn
```

### 🚀 Quick Start

```bash
# Development
npm start

# Application will be available at http://localhost:3000
```

### 📦 Production Build

```bash
npm run build
```

The `build/` folder will contain your optimized application.

### 🧪 Testing & Quality

```bash
# Run tests
npm test

# Check code (linting)
npm run lint
```

### ⚙️ Configuration

Create a `.env` file at the project root:

```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=your_api_key
```

### 📁 Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Application pages
├── hooks/          # Custom hooks
├── services/       # API services
├── context/        # Context API for global state
├── assets/         # Images, fonts, etc.
├── styles/         # Global styles
├── App.jsx         # Main component
└── index.jsx       # Entry point
```

### 🌐 Deployment

Deploy easily to:
- **Netlify**: Drag and drop the `build/` folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Use `gh-pages` package

Don't forget to configure your environment variables on your hosting platform.

### 🤝 Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.