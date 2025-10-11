# CryptoPilot

CryptoPilot est une application complète permettant de suivre les prix des cryptomonnaies en temps réel. Elle inclut une API pour récupérer les données et un front-end interactif pour les visualiser.

## Fonctionnalités

- **Scraping des données** : Récupération des données des cryptomonnaies via un script Python.
- **API REST** : Fournit des endpoints pour accéder aux données des cryptomonnaies.
- **Visualisation des données** : Affichage des prix et graphiques interactifs pour chaque cryptomonnaie.
- **Mise à jour automatique** : Utilisation de WebSocket pour notifier le front-end des changements.

## Structure du projet

```
CryptoPilot/
├── api/                # API Node.js
│   ├── index.js        # Point d'entrée principal de l'API
│   ├── controller/     # Logique métier
│   └── routes/         # Définition des routes
├── cryptopilot-app/    # Front-end React
│   ├── src/            # Code source React
│   └── public/         # Fichiers statiques
├── scripts/            # Scripts Python
│   └── ScrappingCMC.py # Script de scraping des données
└── cryptos.db          # Base de données SQLite
```

## Installation

### Prérequis
- Node.js (v22.19.0 ou supérieur)
- Python (v3.10 ou supérieur)
- SQLite

### Étapes

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/lgadrien/0-CryptoPilot.git
   cd 0-CryptoPilot
   ```

2. Installez les dépendances pour l'API :
   ```bash
   cd api
   npm install
   ```

3. Installez les dépendances pour le front-end :
   ```bash
   cd ../cryptopilot-app
   npm install
   ```

4. Configurez la base de données :
   - Assurez-vous que le fichier `cryptos.db` est présent à la racine du projet.
   - Exécutez le script Python pour initialiser les données :
     ```bash
     python scripts/ScrappingCMC.py
     ```

## Utilisation

### Démarrer l'API
```bash
cd api
npm run dev
```
L'API sera disponible sur `http://localhost:3000`.

### Démarrer le front-end
```bash
cd cryptopilot-app
npm run dev
```
Le front-end sera disponible sur `http://localhost:5173`.

## Technologies utilisées

- **Back-end** : Node.js, Express, SQLite
- **Front-end** : React, Vite, Chart.js
- **Scripts** : Python, SQLite

## Auteur

- **Adrien LG**

## Licence

Ce projet est sous licence MIT.