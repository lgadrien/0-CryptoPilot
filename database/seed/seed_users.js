#!/usr/bin/env node

/**
 * Seed users into the database
 * 
 * USAGE:
 *   node seed_users.js [numberOfUsers]
 * 
 * EXAMPLES:
 *   node seed_users.js              # Seeds default 5 users
 *   node seed_users.js 10           # Seeds 10 users
 *   node seed_users.js 50           # Seeds 50 users
 * 
 * ENVIRONMENT VARIABLES (or use .env file):
 *   SEED_DB_HOST=localhost
 *   SEED_DB_PORT=5432
 *   SEED_DB_USER=useradmin
 *   SEED_DB_PASSWORD=admin123
 *   SEED_DB_NAME=cryptopilot_db
 *   SEED_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuvwxyz (bcrypt hash for test)
 *   SEED_DEFAULT_COUNT=5
 */

const { Pool } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configuration
const numberOfUsers = parseInt(process.argv[2]) || parseInt(process.env.SEED_DEFAULT_COUNT) || 5;

// Database connection pool
const pool = new Pool({
  host: process.env.SEED_DB_HOST || 'localhost',
  port: parseInt(process.env.SEED_DB_PORT) || 5432,
  user: process.env.SEED_DB_USER || 'useradmin',
  password: process.env.SEED_DB_PASSWORD || 'admin123',
  database: process.env.SEED_DB_NAME || 'cryptopilot_db',
});

// Password hash for seeded users
const seedPasswordHash = process.env.SEED_PASSWORD_HASH || '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36XQk';

// Sample wallet addresses (Ethereum mainnet token contracts)
const walletAddresses = [
  '0x742d35Cc6634C0532925a3b844Bc0e7E0c6dDcD0', // No address
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0x2260FAC5E5542a773Aa44fBCfeDd86a04a3dA9FA', // WBTC
  '0x7Fc66500c84A76Ad7e9c93437E434122A1f9AcDd', // AAVE
  '0xc944E90c64B2c07662A292be6244BDf05Cda44b7', // GRT
];

const walletTypes = ['metamask', 'phantom', 'metamask', 'phantom'];
const bioExamples = [
  'Passionate crypto trader focusing on DeFi',
  'Building the future of decentralized finance',
  'HODLing and staking since 2018',
  'NFT collector and web3 enthusiast',
  'Quantitative trader analyzing market data',
  'Web3 developer exploring smart contracts',
  'Community contributor to DeFi protocols',
  'AI and crypto research enthusiast',
];

// Generate fake but realistic data
function generateUser(index) {
  const walletIndex = index % walletAddresses.length;
  const walletTypeIndex = index % walletTypes.length;
  
  return {
    email: `user_${index}@cryptopilot.test`,
    username: `crypto_trader_${String(index).padStart(3, '0')}`,
    password: seedPasswordHash, // Use consistent hash from .env
    wallet_address: walletAddresses[walletIndex],
    wallet_type: walletTypes[walletTypeIndex],
    phone_number: null,
    status: index % 20 === 0 ? 'suspended' : 'active',
    is_2fa_enabled: index % 3 === 0,
    email_verified_at: index % 4 === 0 ? null : 'NOW()',
    bio: bioExamples[index % bioExamples.length],
    last_login: index % 2 === 0 ? 'NOW()' : "NOW() - INTERVAL '" + (index % 30) + " days'",
  };
}

async function seedUsers() {
  const client = await pool.connect();
  
  try {
    console.log(`\n🌱 Seeding ${numberOfUsers} users into the database...\n`);
    
    let insertedCount = 0;
    
    for (let i = 1; i <= numberOfUsers; i++) {
      const user = generateUser(i);
      
      const query = `
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
          $1, $2, $3, $4, $5, $6, $7, $8, 
          ${user.email_verified_at === null ? 'NULL' : user.email_verified_at},
          $9,
          ${user.last_login}
        )
        ON CONFLICT (email) DO NOTHING
      `;
      
      try {
        const result = await client.query(query, [
          user.email,
          user.username,
          user.password,
          user.wallet_address,
          user.wallet_type,
          user.phone_number,
          user.status,
          user.is_2fa_enabled,
          user.bio,
        ]);
        
        if (result.rowCount > 0) {
          insertedCount++;
          if (i % 10 === 0) {
            process.stdout.write(`✓ Inserted ${i} users\n`);
          }
        }
      } catch (error) {
        console.error(`⚠️  Error inserting user ${i}:`, error.message);
      }
    }
    
    // Display results
    const result = await client.query('SELECT COUNT(*) as total FROM users');
    const totalUsers = result.rows[0].total;
    
    console.log(`\n✅ Seeding complete!`);
    console.log(`📊 Total users in database: ${totalUsers}`);
    console.log(`✓ Successfully inserted: ${insertedCount} new users\n`);
    
    // Show sample
    console.log('📋 Sample users:');
    const sampleResult = await client.query(
      'SELECT id, email, username, wallet_type, status, is_2fa_enabled, created_at FROM users LIMIT 5'
    );
    console.table(sampleResult.rows);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run seeding
seedUsers()
  .then(() => {
    console.log('\n🎉 Done!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
