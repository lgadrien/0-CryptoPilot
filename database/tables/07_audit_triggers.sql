-- ============================================================================
-- FILE: 07_audit_triggers.sql
-- PURPOSE: Create triggers to automatically log all changes to audit_logs table
-- DESCRIPTION:
--   This file contains triggers that automatically record INSERT, UPDATE, and
--   DELETE operations on the users, portfolios, and holdings tables.
--   Every change is logged with:
--   - table_name: Which table was modified
--   - record_id: Which record (by ID)
--   - action: INSERT, UPDATE, or DELETE
--   - old_values: Previous data (NULL for INSERT)
--   - new_values: New data (NULL for DELETE)
--   - user_id: Who made the change (NULL if system)
--   - timestamp: When it happened (automatic)
-- ============================================================================

-- Function to log changes to audit_logs
-- This function is called by triggers on INSERT, UPDATE, DELETE
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_old_values JSONB;
  v_new_values JSONB;
  v_user_id INTEGER;
BEGIN
  -- Try to get current user from session (if available)
  -- For now, we'll use NULL (can be set from API)
  v_user_id := NULL;

  -- Prepare old and new values based on operation type
  IF TG_OP = 'INSERT' THEN
    v_old_values := NULL;
    v_new_values := row_to_json(NEW)::JSONB;
    
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id, timestamp)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, v_old_values, v_new_values, v_user_id, CURRENT_TIMESTAMP);
    
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    v_old_values := row_to_json(OLD)::JSONB;
    v_new_values := row_to_json(NEW)::JSONB;
    
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id, timestamp)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, v_old_values, v_new_values, v_user_id, CURRENT_TIMESTAMP);
    
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    v_old_values := row_to_json(OLD)::JSONB;
    v_new_values := NULL;
    
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id, timestamp)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, v_old_values, v_new_values, v_user_id, CURRENT_TIMESTAMP);
    
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUDIT TRIGGERS FOR EACH TABLE
-- ============================================================================

-- Trigger for users table
DROP TRIGGER IF EXISTS audit_users_changes ON users;
CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

COMMENT ON TRIGGER audit_users_changes ON users IS
'Automatically log all INSERT, UPDATE, DELETE operations on users table to audit_logs';

-- Trigger for portfolios table
DROP TRIGGER IF EXISTS audit_portfolios_changes ON portfolios;
CREATE TRIGGER audit_portfolios_changes
AFTER INSERT OR UPDATE OR DELETE ON portfolios
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

COMMENT ON TRIGGER audit_portfolios_changes ON portfolios IS
'Automatically log all INSERT, UPDATE, DELETE operations on portfolios table to audit_logs';

-- Trigger for holdings table
DROP TRIGGER IF EXISTS audit_holdings_changes ON holdings;
CREATE TRIGGER audit_holdings_changes
AFTER INSERT OR UPDATE OR DELETE ON holdings
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

COMMENT ON TRIGGER audit_holdings_changes ON holdings IS
'Automatically log all INSERT, UPDATE, DELETE operations on holdings table to audit_logs';

-- ============================================================================
-- QUERY EXAMPLES TO VIEW AUDIT LOGS
-- ============================================================================
-- View all changes to users table:
-- SELECT * FROM audit_logs WHERE table_name = 'users' ORDER BY timestamp DESC;
--
-- View all DELETE operations:
-- SELECT * FROM audit_logs WHERE action = 'DELETE' ORDER BY timestamp DESC;
--
-- View what changed for a specific user (id = 1):
-- SELECT action, old_values, new_values, timestamp FROM audit_logs 
-- WHERE table_name = 'users' AND record_id = 1 
-- ORDER BY timestamp DESC;
--
-- View specific field changes (e.g., email changes):
-- SELECT 
--   action, 
--   old_values->>'email' as old_email,
--   new_values->>'email' as new_email,
--   timestamp 
-- FROM audit_logs 
-- WHERE table_name = 'users' AND old_values->>'email' IS NOT NULL
-- ORDER BY timestamp DESC;
-- ============================================================================
