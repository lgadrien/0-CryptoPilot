# 🚀 CryptoPilot API

API REST Node.js avec Express et PostgreSQL pour l'application CryptoPilot.

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier et configurer .env (déjà configuré pour Docker)
# Les valeurs par défaut correspondent au docker-compose.yml
```

## 🔧 Configuration

Le fichier `.env` contient :
- **Database** : PostgreSQL (localhost:5432)
- **Server** : Port 3000
- **JWT** : Secret pour l'authentification (à changer en prod)

## 🚀 Démarrage

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'API sera accessible sur **http://localhost:3000**

## 📚 Endpoints disponibles

### 🏠 Routes générales

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Informations API |
| GET | `/health` | Statut de la connexion DB |

### 👥 Users (CRUD complet)

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| GET | `/api/users` | Liste tous les users | - |
| GET | `/api/users/:id` | Récupère un user | - |
| POST | `/api/users` | Crée un user | `{name, email, password}` |
| PUT | `/api/users/:id` | Modifie un user | `{name?, email?, password?}` |
| DELETE | `/api/users/:id` | Supprime un user | - |

## 📝 Exemples d'utilisation

### GET - Tous les utilisateurs
```bash
curl http://localhost:3000/api/users
```

**Réponse :**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Adrien",
      "email": "adrien@cryptopilot.com",
      "created_at": "2025-11-09T10:00:00.000Z",
      "updated_at": "2025-11-09T10:00:00.000Z"
    }
  ]
}
```

### GET - Un utilisateur par ID
```bash
curl http://localhost:3000/api/users/1
```

### POST - Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-11-09T11:30:00.000Z"
  }
}
```

### PUT - Mettre à jour un utilisateur
```bash
curl -X PUT http://localhost:3000/api/users/3 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }'
```

### DELETE - Supprimer un utilisateur
```bash
curl -X DELETE http://localhost:3000/api/users/3
```

## 🔒 Sécurité

- ✅ **Bcrypt** pour hasher les mots de passe (10 rounds)
- ✅ **CORS** configuré pour Vite (localhost:5173)
- ✅ **Validation** des champs requis
- ✅ **Vérification unicité** email
- ✅ **Gestion d'erreurs** complète

## 📂 Structure

```
api/
├── config/
│   └── database.js        # Pool PostgreSQL
├── controllers/
│   └── userController.js  # Logique métier users
├── routes/
│   └── users.js           # Routes users
├── index.js               # Point d'entrée
├── .env                   # Variables d'environnement
├── package.json           # Dépendances
└── README.md             # Documentation
```

## 🛠️ Technologies

- **Express 4.18** - Framework web
- **pg 8.11** - Driver PostgreSQL
- **bcrypt 5.1** - Hash passwords
- **jsonwebtoken 9.0** - JWT (pour auth future)
- **dotenv 16.3** - Variables d'environnement
- **cors 2.8** - Cross-Origin Resource Sharing
- **nodemon 3.0** - Auto-reload en dev

## 🔄 Prochaines étapes

- [ ] Routes pour Portfolio (CRUD)
- [ ] Routes pour Crypto Prices (CRUD)
- [ ] Routes pour Transactions (CRUD)
- [ ] Authentication avec JWT
- [ ] Middleware de protection des routes
- [ ] Rate limiting
- [ ] Validation avec Joi/Zod

## 🐛 Troubleshooting

### Erreur de connexion PostgreSQL
```
❌ Erreur PostgreSQL inattendue
```
➡️ Vérifier que Docker est lancé : `docker-compose ps`

### Port 3000 déjà utilisé
➡️ Changer le port dans `.env` : `PORT=3001`

### Erreur bcrypt
➡️ Réinstaller : `npm rebuild bcrypt --build-from-source`

---

**Développé pour CryptoPilot** 🚀  
API Version: 1.0.0  
Node.js: 18+  
PostgreSQL: 16
