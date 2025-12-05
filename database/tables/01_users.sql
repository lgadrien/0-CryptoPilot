-- Créer la table users si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS users (
  -- Colonne id : clé primaire auto-incrémentée (commence à 1, s'incrémente automatiquement)
  id SERIAL PRIMARY KEY,
  
  -- Colonne email : chaîne de max 255 caractères, unique (pas de doublons) et obligatoire
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- Colonne password : chaîne de max 255 caractères pour stocker le mot de passe hashé, obligatoire
  password VARCHAR(255) NOT NULL,
  
  -- Colonne email_verified_at : timestamp de vérification de l'email
  email_verified_at TIMESTAMP,
  
  -- Colonne phone_number : numéro de téléphone pour l'authentification 2FA
  phone_number VARCHAR(20),
  
  -- Colonne status : statut du compte (active, suspended, deleted)
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  
  -- Colonne ip_address_last_login : adresse IP de la dernière connexion (IPv4 ou IPv6)
  ip_address_last_login VARCHAR(45),
  
  -- Colonne device_info : informations du device/navigateur du dernier login
  device_info VARCHAR(255),
  
  -- Colonne failed_login_attempts : nombre de tentatives de connexion échouées
  failed_login_attempts INT DEFAULT 0,
  
  -- Colonne username : chaîne de max 100 caractères pour le nom d'utilisateur, unique et obligatoire
  username VARCHAR(100) UNIQUE NOT NULL,
  
  -- Colonne wallet_address : adresse du portefeuille crypto (MetaMask ou Phantom), unique et optionnelle
  wallet_address VARCHAR(255) UNIQUE,
  
  -- Colonne wallet_type : type de portefeuille (metamask, phantom, etc.)
  wallet_type VARCHAR(50),
  
  -- Colonne is_verified : indique si l'utilisateur a vérifié son email (true/false)
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Colonne verification_token : token pour vérifier l'email
  verification_token VARCHAR(255),
  
  -- Colonne is_2fa_enabled : indique si l'authentification à 2 facteurs est activée
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  
  -- Colonne bio : description courte de l'utilisateur
  bio TEXT,
  
  -- Colonne profile_picture_url : URL de la photo de profil
  profile_picture_url VARCHAR(500),
  
  -- Colonne last_login : date du dernier login
  last_login TIMESTAMP,
  
  -- Colonne created_at : timestamp de création, défaut = date/heure actuelle
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Colonne updated_at : timestamp de dernière mise à jour, défaut = date/heure actuelle
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur la colonne email pour accélérer les recherches par email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Créer un index sur la colonne username pour accélérer les recherches par username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Créer un index sur la colonne wallet_address pour accélérer les recherches par adresse portefeuille
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Créer un index sur la colonne is_verified pour les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);

-- Créer un index sur created_at pour les requêtes chronologiques
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Ajouter une description de la table
COMMENT ON TABLE users IS 'Table des utilisateurs CryptoPilot avec support wallets crypto';

-- Ajouter des descriptions pour chaque colonne
COMMENT ON COLUMN users.id IS 'Identifiant unique auto-incrémenté';
COMMENT ON COLUMN users.email IS 'Email unique de l''utilisateur (point de connexion principal)';
COMMENT ON COLUMN users.password IS 'Mot de passe hashé avec bcrypt';
COMMENT ON COLUMN users.email_verified_at IS 'Date et heure de vérification de l''email';
COMMENT ON COLUMN users.phone_number IS 'Numéro de téléphone pour 2FA';
COMMENT ON COLUMN users.status IS 'Statut du compte: active (actif), suspended (suspendu), deleted (supprimé)';
COMMENT ON COLUMN users.ip_address_last_login IS 'Adresse IP de la dernière tentative de connexion';
COMMENT ON COLUMN users.device_info IS 'Informations du device/navigateur utilisé pour la connexion';
COMMENT ON COLUMN users.failed_login_attempts IS 'Compteur de tentatives de connexion échouées (réinitialisé après connexion réussie)';
COMMENT ON COLUMN users.username IS 'Nom d''utilisateur unique et public';
COMMENT ON COLUMN users.wallet_address IS 'Adresse du portefeuille crypto (MetaMask/Phantom)';
COMMENT ON COLUMN users.wallet_type IS 'Type de portefeuille utilisé (metamask, phantom, etc.)';
COMMENT ON COLUMN users.is_verified IS 'Statut de vérification de l''email';
COMMENT ON COLUMN users.verification_token IS 'Token JWT pour vérifier l''email';
COMMENT ON COLUMN users.is_2fa_enabled IS 'Authentification à 2 facteurs activée';
COMMENT ON COLUMN users.bio IS 'Biographie courte de l''utilisateur';
COMMENT ON COLUMN users.profile_picture_url IS 'URL de la photo de profil stockée';
COMMENT ON COLUMN users.last_login IS 'Dernière connexion de l''utilisateur';
COMMENT ON COLUMN users.created_at IS 'Date et heure de création du compte';
COMMENT ON COLUMN users.updated_at IS 'Date et heure de dernière modification';
