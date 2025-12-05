-- Créer la table holdings pour stocker les cryptocurrences détenues par portefeuille
CREATE TABLE IF NOT EXISTS holdings (
  -- Colonne id : clé primaire auto-incrémentée
  id SERIAL PRIMARY KEY,
  
  -- Colonne portfolio_id : clé étrangère vers la table portfolios
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  
  -- Colonne crypto_symbol : symbole de la cryptomonnaie (BTC, ETH, SOL, etc.)
  crypto_symbol VARCHAR(10) NOT NULL,
  
  -- Colonne crypto_name : nom complet de la cryptomonnaie (Bitcoin, Ethereum, Solana)
  crypto_name VARCHAR(100) NOT NULL,
  
  -- Colonne quantity : quantité de coins détenus (avec décimales pour la précision)
  quantity NUMERIC(20, 8) NOT NULL,
  
  -- Colonne average_cost : prix d'achat moyen par coin en USD
  average_cost NUMERIC(18, 2) NOT NULL,
  
  -- Colonne current_price : prix actuel du coin en USD (mis à jour régulièrement)
  current_price NUMERIC(18, 2),
  
  -- Colonne current_value : valeur totale de ce holding (quantity * current_price)
  current_value NUMERIC(20, 2),
  
  -- Colonne total_invested : montant total investi dans ce holding (quantity * average_cost)
  total_invested NUMERIC(20, 2) NOT NULL,
  
  -- Colonne gain_loss : gain ou perte en USD (current_value - total_invested)
  gain_loss NUMERIC(20, 2),
  
  -- Colonne gain_loss_percent : gain ou perte en pourcentage
  gain_loss_percent NUMERIC(7, 2),
  
  -- Colonne unrealized_gain_loss : gain ou perte non réalisé (encore détenu)
  unrealized_gain_loss NUMERIC(20, 2),
  
  -- Colonne last_price_update : dernière mise à jour du prix
  last_price_update TIMESTAMP,
  
  -- Colonne created_at : date de création du holding
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Colonne updated_at : date de dernière mise à jour
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur portfolio_id pour accélérer les requêtes par portefeuille
CREATE INDEX IF NOT EXISTS idx_holdings_portfolio_id ON holdings(portfolio_id);

-- Créer un index sur crypto_symbol pour les recherches par cryptomonnaie
CREATE INDEX IF NOT EXISTS idx_holdings_crypto_symbol ON holdings(crypto_symbol);

-- Créer un index unique pour éviter les doublons (un portfolio ne peut pas avoir 2x le même crypto)
CREATE UNIQUE INDEX IF NOT EXISTS idx_holdings_portfolio_crypto ON holdings(portfolio_id, crypto_symbol);

-- Créer un index sur current_value pour les tris par valeur
CREATE INDEX IF NOT EXISTS idx_holdings_current_value ON holdings(current_value DESC);

-- Créer un index sur gain_loss_percent pour les tris par performance
CREATE INDEX IF NOT EXISTS idx_holdings_gain_loss_percent ON holdings(gain_loss_percent DESC);

-- Ajouter une description de la table
COMMENT ON TABLE holdings IS 'Table des cryptocurrences détenues par les utilisateurs dans leurs portefeuilles';

-- Ajouter des descriptions pour chaque colonne
COMMENT ON COLUMN holdings.id IS 'Identifiant unique auto-incrémenté';
COMMENT ON COLUMN holdings.portfolio_id IS 'Référence vers le portefeuille propriétaire';
COMMENT ON COLUMN holdings.crypto_symbol IS 'Symbole ticker de la cryptomonnaie (BTC, ETH, SOL)';
COMMENT ON COLUMN holdings.crypto_name IS 'Nom complet de la cryptomonnaie';
COMMENT ON COLUMN holdings.quantity IS 'Quantité de coins détenus (8 décimales pour la précision)';
COMMENT ON COLUMN holdings.average_cost IS 'Prix d''achat moyen par coin en USD';
COMMENT ON COLUMN holdings.current_price IS 'Prix actuel du coin en USD (mis à jour par API)';
COMMENT ON COLUMN holdings.current_value IS 'Valeur totale du holding = quantity * current_price';
COMMENT ON COLUMN holdings.total_invested IS 'Montant total investi = quantity * average_cost';
COMMENT ON COLUMN holdings.gain_loss IS 'Gain ou perte en USD = current_value - total_invested';
COMMENT ON COLUMN holdings.gain_loss_percent IS 'Gain ou perte en pourcentage ((current_value - total_invested) / total_invested * 100)';
COMMENT ON COLUMN holdings.unrealized_gain_loss IS 'Gain ou perte non réalisé (holding encore en possession)';
COMMENT ON COLUMN holdings.last_price_update IS 'Dernier timestamp de mise à jour du prix';
COMMENT ON COLUMN holdings.created_at IS 'Date et heure de création du holding';
COMMENT ON COLUMN holdings.updated_at IS 'Date et heure de dernière modification';
