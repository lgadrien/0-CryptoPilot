# Database Seeding

Ce dossier contient les scripts pour seeder (remplir) la base de données avec des données de test.

## 📁 Fichiers

- `seed_users.sql` - Script SQL classique pour insérer des utilisateurs
- `seed_users.js` - Script Node.js pour seeder avec nombre d'utilisateurs variable
- `seed_portfolios.sql` - (À venir) Script pour seeder les portefeuilles
- `seed_holdings.sql` - (À venir) Script pour seeder les holdings

## 🚀 Utilisation

### Option 1: Script SQL via Docker (Recommandé sur Windows)

La manière la plus fiable d'utiliser le seed SQL:

```bash
# Exécuter seed_users.sql
docker exec cryptopilot_db_postgres psql -U useradmin -d cryptopilot_db -f /tmp/seed_users.sql
```

Ou avec le script:
```bash
# Depuis le répertoire database
docker cp seed/seed_users.sql cryptopilot_db_postgres:/tmp/
docker exec cryptopilot_db_postgres psql -U useradmin -d cryptopilot_db -f /tmp/seed_users.sql
```

### Option 2: Script Node.js (Linux/Mac)

Le script Node.js fonctionne mieux sur Linux/Mac:

**Installation des dépendances:**
```bash
npm install pg dotenv
```

**Utilisation:**
```bash
# Seed 5 utilisateurs (défaut)
node database/seed/seed_users.js

# Seed 10 utilisateurs
node database/seed/seed_users.js 10

# Seed 50 utilisateurs
node database/seed/seed_users.js 50
```

### Option 3: Script SQL classique via Adminer

1. Va sur http://localhost:8080
2. Connecte-toi (useradmin / admin123 / cryptopilot_db)
3. Clique sur "SQL command"
4. Copie/colle le contenu de `seed_users.sql`
5. Exécute

## 📊 Données générées

### Users
Chaque utilisateur généré contient:
- ✅ Email unique (`user_X@cryptopilot.test`)
- ✅ Username unique (`crypto_trader_XXX`)
- ✅ Wallet address (Ethereum mainnet contracts)
- ✅ Wallet type (MetaMask ou Phantom)
- ✅ Status (active ou suspended - 1/20 suspendus)
- ✅ 2FA enabled (1/3 des utilisateurs)
- ✅ Email verified (75% vérifiés)
- ✅ Bio et last_login randomisés

## 🔧 Personnalisation

### Modifier les données générées

Édite `seed_users.js`:

```javascript
// Changer les types de wallet
const walletTypes = ['metamask', 'phantom', 'ledger']; 

// Ajouter des bios personnalisées
const bioExamples = [
  'Ma bio personnalisée',
  // ...
];

// Modifier le ratio d'utilisateurs suspendus
status: index % 20 === 0 ? 'suspended' : 'active', // Changer 20 pour un autre nombre
```

### Ajouter des utilisateurs manuellement

Édite `seed_users.sql` et ajoute tes propres INSERT:

```sql
INSERT INTO users (email, username, password, wallet_address, wallet_type, status)
VALUES ('mon@email.com', 'mon_user', 'hash123', '0x...', 'metamask', 'active')
ON CONFLICT (email) DO NOTHING;
```

## ⚠️ Notes importantes

1. **Mots de passe**: Les mots de passe seeder sont des hashes fictifs. En production, utilise `bcrypt`.

2. **Adresses wallet**: Les adresses wallet utilisées sont des vrais contrats ERC-20 (USDT, USDC, DAI, etc.).

3. **Doublons**: Le script utilise `ON CONFLICT DO NOTHING` pour éviter les erreurs si tu re-run.

4. **Audit logs**: Chaque INSERT/UPDATE est automatiquement loggé dans `audit_logs` grâce aux triggers.

## 🎯 Prochaines étapes

- [ ] Créer `seed_portfolios.sql` pour seeder des portefeuilles
- [ ] Créer `seed_holdings.sql` pour seeder des holdings
- [ ] Créer `seed_transactions.sql` pour seeder des transactions
- [ ] Ajouter script pour nettoyer la DB (`reset_db.sql`)

## 📝 Exemple complet

```bash
# 1. Démarrer Docker
cd database
docker compose up -d

# 2. Attendre que la DB soit prête (5-10 secondes)

# 3. Seeder 20 utilisateurs
node seed/seed_users.js 20

# 4. Vérifier dans Adminer
# Va sur http://localhost:8080 et connecte-toi
# Tu verras 20 users créés!
```

## 🐛 Troubleshooting

**Erreur: "connect ECONNREFUSED"**
- Vérifie que Docker est lancé: `docker compose ps`
- Vérifie les credentials dans `seed_users.js`

**Erreur: "database does not exist"**
- Le container a peut-être crashé. Redémarre: `docker compose down; docker compose up -d`

**Erreur: "module 'pg' not found"**
- Installe pg: `npm install pg`

## 📞 Support

Besoin d'aide? Contacte pour des modifications ou demandes spécifiques!
