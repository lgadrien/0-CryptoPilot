# 🚀 CryptoPilot - Frontend Application

Application web moderne de suivi de portefeuille de cryptomonnaies avec interface responsive et thème sombre/clair.

## ✨ Fonctionnalités

- 📊 **Dashboard interactif** - Visualisation en temps réel de votre portefeuille
- 🔐 **Authentification** - Système de login/register sécurisé
- 📱 **Responsive design** - Optimisé mobile, tablette et desktop
- 🌓 **Dark/Light mode** - Changement de thème fluide sans décalage
- 📈 **Ticker crypto** - Défilement automatique des prix en temps réel (CoinGecko API)
- 💰 **Calculateur P&L** - Calcul de profit/perte instantané
- 🎨 **UI moderne** - Interface élégante avec Tailwind CSS et animations
- ⚡ **Performance optimisée** - React.memo, useCallback, useMemo pour zéro re-render inutile
- 🎯 **Logos crypto animés** - 9 cryptos avec effet de flottement et positionnement aléatoire anti-collision

---

## 🛠️ Stack technique

- **React 18.3** - Framework UI avec hooks modernes optimisés
- **Vite 6.0** - Build tool ultra-rapide avec HMR
- **Tailwind CSS v3** - Framework CSS utility-first
- **React Router v6** - Navigation côté client
- **Lucide React v0.553.0** - Bibliothèque d'icônes
- **CoinGecko API** - Prix crypto en temps réel

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
│   │   │   ├── Header.jsx       # Menu navigation + hamburger mobile (optimisé avec useCallback)
│   │   │   └── Footer.jsx       # Pied de page
│   │   ├── ui/
│   │   │   └── ThemeToggle.jsx  # Bouton Dark/Light mode
│   │   ├── CryptoTicker.jsx     # Bandeau défilant des prix (CoinGecko API, React.memo)
│   │   ├── Login.jsx            # Formulaire de connexion (useCallback)
│   │   ├── Register.jsx         # Formulaire d'inscription (useCallback)
│   │   ├── GuestRoute.jsx       # Protection des routes
│   │   └── PnLCalculator.jsx    # Calculateur profit/perte
│   ├── context/
│   │   ├── AuthContext.jsx      # Gestion authentification (useMemo + useCallback)
│   │   └── ThemeContext.jsx     # Gestion du thème (useMemo + useCallback)
│   ├── pages/
│   │   ├── Home.jsx             # Page d'accueil + logos animés (collision detection)
│   │   ├── Dashboard.jsx        # Tableau de bord principal
│   │   └── NotFound.jsx         # Page 404
│   ├── App.jsx                  # Router et layout global
│   ├── main.jsx                 # Point d'entrée React
│   └── index.css                # Styles globaux + animations
├── index.html                   # HTML de base avec script anti-flash
├── vite.config.js               # Configuration Vite
├── tailwind.config.js           # Configuration Tailwind + animations personnalisées
├── postcss.config.js            # Configuration PostCSS
└── package.json                 # Dépendances et scripts
```

---

## 🎯 Composants optimisés

### Home.jsx
- **FeatureCard** - Mémorisé avec React.memo
- **CryptoLogo** - Mémorisé avec lazy loading
- **Features array** - useMemo pour éviter re-création
- **Collision detection** - Algorithme de distance euclidienne pour espacement des logos
- **Random positions** - useEffect avec state pour positionnement aléatoire au reload
- **9 logos crypto** : Bitcoin, Ethereum, Solana, Cardano, Polkadot, Astar, Astarter, Aster v2, + 1
- **5 animations float** : Variations de translateY (-10px à -20px)

### Header.jsx
- **NavLink** - Composant mémorisé réutilisable
- **handleLogout, closeMobileMenu, toggleUserMenu, toggleMobileMenu** - useCallback
- Menu mobile avec overlay et click-outside detection
- Dropdown utilisateur avec profil et notifications

### CryptoTicker.jsx
- **CryptoItem** - React.memo pour chaque crypto
- **fetchData** - useCallback pour éviter re-création
- API CoinGecko avec retry sur rate limit (429)
- Animation marquee infinie avec pause on hover
- 20 cryptos affichées en boucle

### Login.jsx & Register.jsx
- **togglePassword** - useCallback pour optimiser le toggle de visibilité
- Validation HTML5 native
- Eye/EyeOff icons (Lucide)

### AuthContext & ThemeContext
- **Context value** - useMemo pour éviter re-renders en cascade
- **login, logout, toggleTheme** - useCallback
- Persistance localStorage

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

### Performance React

- ✅ **React.memo** - Composants mémorisés (FeatureCard, CryptoLogo, CryptoItem, NavLink)
- ✅ **useCallback** - Fonctions mémorisées (toggles, handlers, logout)
- ✅ **useMemo** - Valeurs calculées mises en cache (features, context values)
- ✅ **Lazy loading** - Images avec `loading="lazy"`
- ✅ **Context optimization** - AuthContext et ThemeContext avec useMemo pour éviter re-renders
- ✅ **Code splitting** automatique (Vite)
- ✅ **Tree shaking** des dépendances
- ✅ **Minification** en production

### Animations optimisées

- ✅ **Float animations** - 5 variations pour les logos crypto (translateY uniquement)
- ✅ **Collision detection** - Algorithme anti-chevauchement des logos (distance euclidienne)
- ✅ **Random positioning** - Positionnement aléatoire à chaque reload avec state React
- ✅ **CSS animations** - Performances GPU avec transform et opacity

### UX

- ✅ Transitions fluides (0.3s ease)
- ✅ Feedback visuel sur hover/active
- ✅ Focus states accessibles
- ✅ Icônes SVG optimisées (Lucide)
- ✅ Marquee animation avec pause on hover (CryptoTicker)

---

## 📱 Mobile Features

### Hamburger Menu

- Animation slide-down smooth
- Click outside pour fermer automatiquement
- Icônes claires (Home, Dashboard, Logout)
- Overlay semi-transparent
- NavLink optimisé avec React.memo

### Password Toggle

- Icône Eye/EyeOff (Lucide)
- Toggle indépendant pour chaque champ (useCallback)
- Focus states optimisés
- Accessibilité ARIA

### Touch-friendly

- Boutons min 44x44px (Apple HIG)
- Espacement adapté tactile
- Pas de hover states sur mobile
- Swipe gestures ready

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
- [ ] Graphiques Recharts interactifs
- [ ] Implémentation du calculateur P&L

### Moyen terme
- [ ] PWA (Progressive Web App)
- [ ] Notifications push
- [ ] Multi-langue (i18n)
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Storybook composants

### Long terme
- [ ] WebSocket pour prix temps réel
- [ ] Mode offline
- [ ] Export PDF du portfolio
- [ ] Alertes prix personnalisées
- [ ] Analyse technique (RSI, MACD, Bollinger)

---

## 📊 Changelog

### v1.1.0 (Novembre 2025)
- ✅ Optimisation complète des composants avec React.memo, useCallback, useMemo
- ✅ Système de collision detection pour les logos crypto
- ✅ 9 logos crypto animés avec float effect
- ✅ Positionnement aléatoire des logos à chaque reload
- ✅ Optimisation des contextes (Auth & Theme)
- ✅ NavLink component réutilisable et mémorisé
- ✅ CryptoTicker optimisé avec API CoinGecko

### v1.0.0 (Novembre 2025)
- 🎉 Version initiale
- React 18 + Vite 6
- Dark/Light mode sans flash
- Responsive design complet
- Authentification locale
- Dashboard crypto

---

**Développé avec ❤️ pour CryptoPilot**  
Version: 1.1.0  
Framework: React 18 + Vite 6  
Dernière mise à jour: 9 Novembre 2025

---
