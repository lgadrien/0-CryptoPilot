-- Ajouter des contraintes CHECK pour validations au niveau base de données
-- Ces contraintes assurent l'intégrité des données à la source

-- ============================================
-- CONTRAINTES POUR LA TABLE HOLDINGS
-- ============================================

-- Contrainte: quantity doit être strictement positive
ALTER TABLE holdings ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);

-- Contrainte: average_cost doit être positif ou zéro
ALTER TABLE holdings ADD CONSTRAINT check_average_cost_non_negative CHECK (average_cost >= 0);

-- Contrainte: current_price doit être positif ou zéro
ALTER TABLE holdings ADD CONSTRAINT check_current_price_non_negative CHECK (current_price >= 0 OR current_price IS NULL);

-- Contrainte: total_invested doit être positif ou zéro
ALTER TABLE holdings ADD CONSTRAINT check_total_invested_non_negative CHECK (total_invested >= 0);

-- Contrainte: current_value doit être positif ou zéro
ALTER TABLE holdings ADD CONSTRAINT check_current_value_non_negative CHECK (current_value >= 0 OR current_value IS NULL);

-- ============================================
-- CONTRAINTES POUR LA TABLE PORTFOLIOS
-- ============================================

-- Contrainte: total_value doit être positif ou zéro
ALTER TABLE portfolios ADD CONSTRAINT check_total_value_positive CHECK (total_value >= 0);

-- ============================================
-- CONTRAINTES POUR LA TABLE USERS
-- ============================================

-- Contrainte: failed_login_attempts doit être positif ou zéro
ALTER TABLE users ADD CONSTRAINT check_failed_login_attempts_non_negative CHECK (failed_login_attempts >= 0);

-- ============================================
-- Commentaires sur les contraintes
-- ============================================
COMMENT ON CONSTRAINT check_quantity_positive ON holdings IS 'Assure que la quantité de crypto est toujours positive';
COMMENT ON CONSTRAINT check_average_cost_non_negative ON holdings IS 'Le prix d''achat moyen ne peut pas être négatif';
COMMENT ON CONSTRAINT check_current_price_non_negative ON holdings IS 'Le prix actuel ne peut pas être négatif (NULL si pas de données)';
COMMENT ON CONSTRAINT check_total_invested_non_negative ON holdings IS 'Le montant total investi ne peut pas être négatif';
COMMENT ON CONSTRAINT check_current_value_non_negative ON holdings IS 'La valeur totale ne peut pas être négative (NULL si pas de données)';
COMMENT ON CONSTRAINT check_total_value_positive ON portfolios IS 'La valeur totale du portefeuille ne peut pas être négative';
COMMENT ON CONSTRAINT check_failed_login_attempts_non_negative ON users IS 'Le compteur de tentatives échouées ne peut pas être négatif';
