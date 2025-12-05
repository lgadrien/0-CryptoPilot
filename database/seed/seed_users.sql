-- ============================================================================
-- FILE: seed_users.sql
-- PURPOSE: Seed sample users into the database
-- DESCRIPTION:
--   This file contains INSERT statements to populate the users table with
--   sample data for testing and development. Adjust the number of users
--   by copying/modifying the INSERT statements.
--
-- USAGE:
--   To run this seed file:
--   psql -h localhost -U useradmin -d cryptopilot_db -f seed_users.sql
--
--   Or from inside psql:
--   \i seed/seed_users.sql
--
-- NOTE:
--   - Passwords are hashed (in production, use bcrypt)
--   - email_verified_at is NULL for most users (can be set to CURRENT_TIMESTAMP if verified)
--   - For testing, you can modify wallet addresses to test wallet integration
-- ============================================================================

-- Insert sample users
-- User 1: Admin/Test User
INSERT INTO users (
  email, 
  username, 
  password, 
  wallet_address, 
  wallet_type, 
  phone_number, 
  status, 
  is_2fa_enabled, 
  email_verified_at,
  last_login
) VALUES (
  'admin@cryptopilot.test',
  'admin_trader',
  '$2b$10$abcdefghijklmnopqrstuvwxyz', -- bcrypt hash example
  '0x742d35Cc6634C0532925a3b844Bc0e7E0c6dDcD0',
  'metamask',
  '+33612345678',
  'active',
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- User 2: Test Trader
INSERT INTO users (
  email, 
  username, 
  password, 
  wallet_address, 
  wallet_type, 
  phone_number, 
  status, 
  is_2fa_enabled, 
  email_verified_at,
  bio,
  last_login
) VALUES (
  'trader@cryptopilot.test',
  'crypto_trader_001',
  '$2b$10$hijklmnopqrstuvwxyzabcdef', -- bcrypt hash example
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'phantom',
  '+33687654321',
  'active',
  FALSE,
  CURRENT_TIMESTAMP,
  'Passionate crypto trader focusing on DeFi',
  CURRENT_TIMESTAMP - INTERVAL '2 days'
) ON CONFLICT (email) DO NOTHING;

-- User 3: New User (Not Verified)
INSERT INTO users (
  email, 
  username, 
  password, 
  wallet_address, 
  wallet_type, 
  status, 
  is_2fa_enabled
) VALUES (
  'newuser@cryptopilot.test',
  'new_investor_001',
  '$2b$10$klmnopqrstuvwxyzabcdefghij', -- bcrypt hash example
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'metamask',
  'active',
  FALSE
) ON CONFLICT (email) DO NOTHING;

-- User 4: Suspended User
INSERT INTO users (
  email, 
  username, 
  password, 
  wallet_address, 
  wallet_type, 
  status, 
  is_2fa_enabled,
  email_verified_at
) VALUES (
  'suspended@cryptopilot.test',
  'suspended_user',
  '$2b$10$lmnopqrstuvwxyzabcdefghijk', -- bcrypt hash example
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  'phantom',
  'suspended',
  TRUE,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- User 5: User with 2FA enabled
INSERT INTO users (
  email, 
  username, 
  password, 
  wallet_address, 
  wallet_type, 
  phone_number, 
  status, 
  is_2fa_enabled,
  email_verified_at
) VALUES (
  'secure@cryptopilot.test',
  'secure_trader',
  '$2b$10$mnopqrstuvwxyzabcdefghijkl', -- bcrypt hash example
  '0x2260FAC5E5542a773Aa44fBCfeDd86a04a3dA9FA',
  'metamask',
  '+33698765432',
  'active',
  TRUE,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- TO ADD MORE USERS:
-- Simply duplicate the INSERT statement above, modify the email, username,
-- and wallet_address values. Keep the status as 'active' for testing.
-- ============================================================================
-- Example of adding 10 more users:
-- INSERT INTO users (email, username, password, wallet_address, wallet_type, status, is_2fa_enabled)
-- VALUES ('user6@test.com', 'user_006', 'hash', '0x...', 'metamask', 'active', FALSE) ON CONFLICT DO NOTHING;
-- INSERT INTO users (email, username, password, wallet_address, wallet_type, status, is_2fa_enabled)
-- VALUES ('user7@test.com', 'user_007', 'hash', '0x...', 'phantom', 'active', FALSE) ON CONFLICT DO NOTHING;
-- ... and so on
-- ============================================================================

-- Display the inserted users
SELECT 'Users inserted successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT id, email, username, wallet_type, status, is_2fa_enabled, created_at FROM users ORDER BY id;
