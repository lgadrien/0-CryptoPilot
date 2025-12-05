-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour mettre à jour automatiquement updated_at
-- Cette fonction est utilisée par tous les triggers des tables
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- NEW = les nouvelles valeurs de la ligne modifiée
  -- Mettre à jour le champ updated_at avec l'heure actuelle
  NEW.updated_at = CURRENT_TIMESTAMP;
  -- RETURN NEW = valider la modification avec les nouvelles valeurs
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Commentaire sur la fonction
COMMENT ON FUNCTION update_timestamp() IS 'Fonction utilitaire pour mettre à jour automatiquement le champ updated_at lors de modifications';

-- ============================================
-- TRIGGERS POUR LA TABLE USERS
-- ============================================

-- Trigger pour mettre à jour automatiquement updated_at dans la table users
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Commentaire sur le trigger
COMMENT ON TRIGGER update_users_timestamp ON users IS 'Met à jour automatiquement updated_at quand une ligne users est modifiée';

-- ============================================
-- TRIGGERS POUR LA TABLE PORTFOLIOS
-- ============================================

-- Trigger pour mettre à jour automatiquement updated_at dans la table portfolios
CREATE TRIGGER update_portfolios_timestamp
BEFORE UPDATE ON portfolios
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Commentaire sur le trigger
COMMENT ON TRIGGER update_portfolios_timestamp ON portfolios IS 'Met à jour automatiquement updated_at quand une ligne portfolios est modifiée';

-- ============================================
-- TRIGGERS POUR LA TABLE HOLDINGS
-- ============================================

-- Trigger pour mettre à jour automatiquement updated_at dans la table holdings
CREATE TRIGGER update_holdings_timestamp
BEFORE UPDATE ON holdings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Commentaire sur le trigger
COMMENT ON TRIGGER update_holdings_timestamp ON holdings IS 'Met à jour automatiquement updated_at quand une ligne holdings est modifiée';

-- ============================================
-- TRIGGERS POUR LA TABLE AUDIT_LOGS
-- ============================================

-- Trigger pour mettre à jour automatiquement updated_at dans la table audit_logs (si elle avait cette colonne)
-- Note: audit_logs n'a pas d'updated_at, donc ce trigger n'est pas nécessaire
-- Mais on le laisse dans le template pour les futures tables

-- ============================================
-- FIN DES TRIGGERS ET FONCTIONS
-- ============================================
COMMENT ON SCHEMA public IS 'Schema public avec triggers d''audit automatiques pour updated_at';
