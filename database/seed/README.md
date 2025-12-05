# Database Seeder

Simple seed script pour remplir la DB avec des utilisateurs de test.

## Usage

```bash
# Installer les dépendances (une seule fois)
npm install

# Seed 5 users (défaut)
npm run seed

# Seed 10 users
npm run seed 10

# Seed 50 users
npm run seed 50

# Seed 100 users
npm run seed 100
```

## Configuration

Édite `.env` pour changer les credentials DB:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=useradmin
DB_PASSWORD=admin123
DB_NAME=cryptopilot_db
```

## Données

Chaque user seeder a:
- Email unique (`user1@test.crypto`, `user2@test.crypto`, etc.)
- Username unique (`trader_001`, `trader_002`, etc.)
- Random wallet (MetaMask ou Phantom)
- 50% des users vérifiés
- 33% avec 2FA activée
- Mot de passe: `password123` (bcrypt hash)

## Notes

- Les doublons sont ignorés (ON CONFLICT DO NOTHING)
- Chaque user est loggé dans `audit_logs` automatiquement (via triggers)
- Connexion DB locale par défaut (localhost:5432)
