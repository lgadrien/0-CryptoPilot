-- Créer la table audit_logs pour tracer tous les changements de données
CREATE TABLE IF NOT EXISTS audit_logs (
  -- Colonne id : clé primaire auto-incrémentée
  id SERIAL PRIMARY KEY,
  
  -- Colonne table_name : nom de la table modifiée
  table_name VARCHAR(50) NOT NULL,
  
  -- Colonne record_id : ID de l'enregistrement modifié
  record_id INTEGER NOT NULL,
  
  -- Colonne action : type d'action effectuée (INSERT, UPDATE, DELETE)
  action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  
  -- Colonne old_values : anciennes valeurs en JSON (NULL pour INSERT)
  old_values JSONB,
  
  -- Colonne new_values : nouvelles valeurs en JSON (NULL pour DELETE)
  new_values JSONB,
  
  -- Colonne user_id : utilisateur qui a effectué l'action (NULL si système)
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Colonne timestamp : date et heure de l'action
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur table_name pour les audits par table
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);

-- Créer un index sur record_id pour tracer un enregistrement spécifique
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);

-- Créer un index sur user_id pour tracer les actions d'un utilisateur
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Créer un index sur action pour filtrer par type d'action
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Créer un index sur timestamp pour les requêtes chronologiques
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Créer un index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id, timestamp DESC);

-- Ajouter une description de la table
COMMENT ON TABLE audit_logs IS 'Journal d''audit pour tracer toutes les modifications de données (INSERT, UPDATE, DELETE)';

-- Ajouter des descriptions pour chaque colonne
COMMENT ON COLUMN audit_logs.id IS 'Identifiant unique auto-incrémenté du log d''audit';
COMMENT ON COLUMN audit_logs.table_name IS 'Nom de la table dont l''enregistrement a été modifié';
COMMENT ON COLUMN audit_logs.record_id IS 'ID de l''enregistrement qui a été modifié';
COMMENT ON COLUMN audit_logs.action IS 'Type d''action: INSERT (création), UPDATE (modification), DELETE (suppression)';
COMMENT ON COLUMN audit_logs.old_values IS 'Anciennes valeurs de l''enregistrement au format JSON (vide pour INSERT)';
COMMENT ON COLUMN audit_logs.new_values IS 'Nouvelles valeurs de l''enregistrement au format JSON (vide pour DELETE)';
COMMENT ON COLUMN audit_logs.user_id IS 'Utilisateur qui a effectué l''action (NULL si action système)';
COMMENT ON COLUMN audit_logs.timestamp IS 'Date et heure exacte de la modification';

-- Ajouter des commentaires sur les indexes
COMMENT ON INDEX idx_audit_logs_table_name IS 'Pour filtrer les audits par table modifiée';
COMMENT ON INDEX idx_audit_logs_record_id IS 'Pour tracer l''historique complet d''un enregistrement';
COMMENT ON INDEX idx_audit_logs_user_id IS 'Pour auditer les actions d''un utilisateur spécifique';
COMMENT ON INDEX idx_audit_logs_action IS 'Pour filtrer par type d''action (INSERT/UPDATE/DELETE)';
COMMENT ON INDEX idx_audit_logs_timestamp IS 'Pour les requêtes triées par date';
COMMENT ON INDEX idx_audit_logs_table_record IS 'Index composite pour les requêtes combinées fréquentes';
