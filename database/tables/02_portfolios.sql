-- Créer la table portfolios pour stocker les portefeuilles des utilisateurs
CREATE TABLE IF NOT EXISTS portfolios (
  -- Colonne id : clé primaire auto-incrémentée
  id SERIAL PRIMARY KEY,
  
  -- Colonne user_id : clé étrangère vers la table users
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Colonne name : nom du portefeuille
  name VARCHAR(100) NOT NULL,
  
  -- Colonne description : description du portefeuille
  description TEXT,
  
  -- Colonne is_public : indique si le portefeuille est public (visible par autres utilisateurs)
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Colonne total_value : valeur totale du portefeuille en USD
  total_value NUMERIC(20, 2) DEFAULT 0,
  
  -- Colonne currency : devise de base du portefeuille (USD, EUR, GBP, etc.)
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Colonne base_currency : devise de base pour les calculs (pour convertir tous les holdings)
  base_currency VARCHAR(3) DEFAULT 'USD',
  
  -- Colonne portfolio_type : type de portefeuille (personnel, groupe, fonds d'investissement)
  portfolio_type VARCHAR(50) DEFAULT 'personal' CHECK (portfolio_type IN ('personal', 'group', 'fund')),
  
  -- Colonne managed_by_id : utilisateur qui gère ce portefeuille (délégation de gestion)
  managed_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Colonne created_at : date de création du portefeuille
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Colonne updated_at : date de dernière mise à jour
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur user_id pour accélérer les requêtes par utilisateur
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);

-- Créer un index sur is_public pour les requêtes de portefeuilles publics
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON portfolios(is_public);

-- Créer un index sur total_value pour les tris par valeur
CREATE INDEX IF NOT EXISTS idx_portfolios_total_value ON portfolios(total_value DESC);

-- Ajouter une description de la table
COMMENT ON TABLE portfolios IS 'Table des portefeuilles crypto des utilisateurs';

-- Ajouter des descriptions pour chaque colonne
COMMENT ON COLUMN portfolios.id IS 'Identifiant unique auto-incrémenté';
COMMENT ON COLUMN portfolios.user_id IS 'Référence vers l''utilisateur propriétaire du portefeuille';
COMMENT ON COLUMN portfolios.name IS 'Nom du portefeuille (ex: Mon premier portefeuille)';
COMMENT ON COLUMN portfolios.description IS 'Description optionnelle du portefeuille';
COMMENT ON COLUMN portfolios.is_public IS 'Indique si le portefeuille est visible publiquement';
COMMENT ON COLUMN portfolios.total_value IS 'Valeur totale du portefeuille en USD (calculée automatiquement)';
COMMENT ON COLUMN portfolios.currency IS 'Devise de base du portefeuille';
COMMENT ON COLUMN portfolios.base_currency IS 'Devise utilisée pour les calculs (convertit tous les holdings)';
COMMENT ON COLUMN portfolios.portfolio_type IS 'Type de portefeuille: personal (personnel), group (groupe), fund (fonds)';
COMMENT ON COLUMN portfolios.managed_by_id IS 'Utilisateur qui gère ce portefeuille (si délégué)';
COMMENT ON COLUMN portfolios.created_at IS 'Date et heure de création du portefeuille';
COMMENT ON COLUMN portfolios.updated_at IS 'Date et heure de dernière modification';
