# 🚀 CryptoPilot - Frontend Application

Application web moderne de suivi de portefeuille de cryptomonnaies avec interface responsive et thème sombre/clair.

## ✨ Fonctionnalités

- 📊 **Dashboard interactif** - Visualisation en temps réel de votre portefeuille
- 🔐 **Authentification** - Système de login/register sécurisé
- 📱 **Responsive design** - Optimisé mobile, tablette et desktop
- 🌓 **Dark/Light mode** - Changement de thème fluide sans décalage
- 📈 **Ticker crypto** - Défilement automatique des prix en temps réel
- 💰 **Calculateur P&L** - Calcul de profit/perte instantané
- 🎨 **UI moderne** - Interface élégante avec Tailwind CSS et animations

---

## 🛠️ Stack technique

- **React 19.1.1** - Framework UI avec hooks modernes
- **Vite 7.1.12** - Build tool ultra-rapide avec HMR
- **Tailwind CSS v3** - Framework CSS utility-first
- **React Router v7.9.5** - Navigation côté client
- **Lucide React v0.553.0** - Bibliothèque d'icônes
- **Recharts 2.15.0** - Graphiques et visualisations
- **Axios** - Client HTTP pour API calls

---

## 📦 Installation

### Prérequis
- Node.js 18+ (recommandé 20+)
- npm ou yarn

### Étapes

```bash
# Naviguer dans le dossier frontend
cd cryptopilot-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

---

## 📂 Structure du projet

```
cryptopilot-app/
├── public/
│   └── assets/          # Images, logos, favicon
├── src/
│   ├── component/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Menu navigation + hamburger mobile
│   │   │   └── Footer.jsx       # Pied de page
│   │   ├── ui/
│   │   │   └── ThemeToggle.jsx  # Bouton Dark/Light mode
│   │   ├── CryptoTicker.jsx     # Bandeau défilant des prix
│   │   ├── Login.jsx            # Formulaire de connexion
│   │   ├── Register.jsx         # Formulaire d'inscription
│   │   └── PnLCalculator.jsx    # Calculateur profit/perte
│   ├── context/
│   │   ├── AuthContext.jsx      # Gestion authentification
│   │   └── ThemeContext.jsx     # Gestion du thème
│   ├── pages/
│   │   ├── Home.jsx             # Page d'accueil
│   │   └── Dashboard.jsx        # Tableau de bord principal
│   ├── App.jsx                  # Router et layout global
│   ├── main.jsx                 # Point d'entrée React
│   └── index.css                # Styles globaux + animations
├── index.html                   # HTML de base avec script anti-flash
├── vite.config.js               # Configuration Vite
├── tailwind.config.js           # Configuration Tailwind
├── postcss.config.js            # Configuration PostCSS
└── package.json                 # Dépendances et scripts
```

---

## 🎨 Responsive Design

### Breakpoints Tailwind utilisés

| Breakpoint | Taille | Utilisation |
|------------|--------|-------------|
| `sm` | 640px | Tablettes portrait |
| `md` | 768px | Tablettes paysage |
| `lg` | 1024px | Desktop small |
| `xl` | 1280px | Desktop large |

### Composants optimisés mobile

- ✅ **Header** - Menu hamburger avec icônes, click-outside-to-close
- ✅ **Dashboard** - Grid responsive (1 col → 2 cols → 3 cols)
- ✅ **CryptoTicker** - Notation compacte sur mobile
- ✅ **Login/Register** - Formulaires adaptés tactile
- ✅ **Footer** - Layout empilé sur mobile

---

## 🌓 Thème Dark/Light

### Sans décalage (FOUC - Flash of Unstyled Content)

Le thème est appliqué **avant le rendu** grâce à un script inline dans `index.html` :

```javascript
// Script exécuté AVANT React
(function() {
  const saved = localStorage.getItem('theme');
  const isDark = saved ? saved === 'dark' : true;
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
})();
```

### Transition smooth

Toutes les couleurs changent avec une **transition CSS de 0.3s** :

```css
* {
  transition-property: background-color, border-color, color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}
```

---

## 🔐 Authentification

### AuthContext

Gestion de l'état utilisateur avec React Context :

```jsx
const { user, login, logout, isAuthenticated } = useAuth();
```

**Fonctionnalités :**
- ✅ Persistance localStorage
- ✅ Routes protégées (redirect si non connecté)
- ✅ Session utilisateur
- 🔄 **TODO :** Connexion API backend + JWT

---

## 📊 Dashboard

### Données affichées

- **Valeur totale du portefeuille** ($)
- **Profit/Perte global** (montant + pourcentage)
- **Liste des cryptos** avec :
  - Quantité possédée
  - Prix actuel
  - Variation 24h
  - Valeur totale
  - P&L individuel

### Graphiques (Recharts)

- 📈 Évolution du portfolio (à venir)
- 🥧 Répartition par crypto (à venir)

---

## 🎯 Scripts disponibles

```bash
# Développement (HMR activé)
npm run dev

# Build production
npm run build

# Preview build production
npm run preview

# Linter
npm run lint
```

---

## 🔗 Connexion API Backend

### Configuration Axios (à venir)

```javascript
// src/config/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Endpoints prévus

- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /portfolio` - Récupérer le portfolio
- `POST /portfolio` - Ajouter une crypto
- `PUT /portfolio/:id` - Modifier
- `DELETE /portfolio/:id` - Supprimer
- `GET /crypto-prices` - Prix actuels

---

## 🎨 Palette de couleurs

### Dark mode (défaut)

```css
--bg-primary: #0B0D12       /* Fond principal */
--bg-secondary: #1C1F26     /* Cartes, modales */
--border: #2A2D35           /* Bordures */
--accent: #D4AF37           /* Or - CTA, liens */
--text-primary: #E5E7EB     /* Texte principal */
--text-secondary: #9CA3AF   /* Texte secondaire */
```

### Light mode

```css
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--border: #E5E7EB
--accent: #D4AF37
--text-primary: #111827
--text-secondary: #6B7280
```

---

## 🚀 Optimisations

### Performance

- ✅ **Lazy loading** des routes (React.lazy)
- ✅ **Code splitting** automatique (Vite)
- ✅ **Tree shaking** des dépendances
- ✅ **Minification** en production
- ✅ **Compression** des assets

### UX

- ✅ Transitions fluides (0.3s ease)
- ✅ Feedback visuel sur hover/active
- ✅ Focus states accessibles
- ✅ Icônes SVG optimisées (Lucide)
- ✅ Skeleton loaders (à venir)

---

## 📱 Mobile Features

### Hamburger Menu

- Animation slide-down
- Click outside pour fermer
- Icônes claires (Home, Dashboard, Logout)
- Overlay semi-transparent

### Password Toggle

- Icône Eye/EyeOff (Lucide)
- Toggle indépendant pour chaque champ
- Focus states optimisés

### Touch-friendly

- Boutons min 44x44px (Apple HIG)
- Espacement adapté tactile
- Pas de hover states sur mobile

---

## 🛡️ Sécurité

### Frontend

- ✅ Validation des inputs (HTML5 + React)
- ✅ Sanitization des données utilisateur
- ✅ HTTPS only en production
- 🔄 **TODO :** Content Security Policy (CSP)
- 🔄 **TODO :** Rate limiting côté client

### Backend (à connecter)

- Passwords hashés (bcrypt)
- JWT avec expiration
- Refresh tokens
- CORS configuré

---

## 🐛 Troubleshooting

### Le thème flash au chargement

✅ **Résolu** avec script inline dans `index.html`

### Vite ne démarre pas

```bash
# Nettoyer le cache
rm -rf node_modules .vite
npm install
```

### Tailwind ne compile pas

Vérifier que `postcss.config.js` existe :

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Port 5173 déjà utilisé

Modifier `vite.config.js` :

```javascript
export default defineConfig({
  server: {
    port: 3001, // Changer le port
  },
})
```

---

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)

---

## 🎯 Prochaines étapes

### Court terme
- [ ] Connexion API backend PostgreSQL
- [ ] JWT Authentication
- [ ] Gestion erreurs API (toast notifications)
- [ ] Skeleton loaders
- [ ] Graphiques Recharts interactifs

### Moyen terme
- [ ] PWA (Progressive Web App)
- [ ] Notifications push
- [ ] Multi-langue (i18n)
- [ ] Tests unitaires (Vitest)
- [ ] Storybook composants

### Long terme
- [ ] WebSocket pour prix temps réel
- [ ] Mode offline
- [ ] Export PDF du portfolio
- [ ] Alertes prix personnalisées

---

**Développé avec ❤️ pour CryptoPilot**  
Version: 1.0.0  
Framework: React 19 + Vite 7  
Dernière mise à jour: Novembre 2025

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
