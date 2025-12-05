#!/usr/bin/env node

/**
 * Simple Database Seeder for CryptoPilot
 * 
 * USAGE:
 *   npm run seed              # Seeds default 5 users
 *   npm run seed 10           # Seeds 10 users
 *   npm run seed 50           # Seeds 50 users
 */

require('dotenv').config();
const { execSync } = require('child_process');

// Constants
const NUM_USERS = parseInt(process.argv[2]) || 5;
const CONTAINER = 'cryptopilot_db_postgres';
const DB_USER = process.env.DB_USER || 'useradmin';
const DB_NAME = process.env.DB_NAME || 'cryptopilot_db';

const WALLET_TYPES = ['metamask', 'phantom'];
const PASSWORD_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36XQk';

// Generate unique wallet addresses
function generateWallet(index) {
  const hex = index.toString(16).padStart(40, '0');
  return '0x' + hex;
}

async function seed() {
  try {
    console.log(`\n🌱 Seeding ${NUM_USERS} users via Docker...\n`);

    let sqlStatements = '';

    for (let i = 1; i <= NUM_USERS; i++) {
      const email = `user${i}@test.crypto`;
      const username = `trader_${String(i).padStart(3, '0')}`;
      const wallet = generateWallet(i);
      const walletType = WALLET_TYPES[i % WALLET_TYPES.length];
      const verified = i % 2 === 0 ? 'NOW()' : 'NULL';
      const twofa = i % 3 === 0 ? 'TRUE' : 'FALSE';

      sqlStatements += `INSERT INTO users (email, username, password, wallet_address, wallet_type, is_2fa_enabled, email_verified_at, status) VALUES ('${email}', '${username}', '${PASSWORD_HASH}', '${wallet}', '${walletType}', ${twofa}, ${verified}, 'active') ON CONFLICT (email) DO NOTHING;\n`;

      if (i % 10 === 0) process.stdout.write(`✓ ${i}/${NUM_USERS}\n`);
    }

    // Execute SQL via docker exec
    const cmd = `docker exec ${CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} -c "${sqlStatements}"`;
    execSync(cmd, { stdio: 'pipe' });

    // Get count
    const countCmd = `docker exec ${CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} -t -c "SELECT COUNT(*) FROM users;"`;
    const count = execSync(countCmd, { encoding: 'utf8' }).trim();

    console.log(`\n✅ Done! Total users: ${count}\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
