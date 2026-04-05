import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rebuild() {
  try {
    console.log('Dropping existing tables...');
    // Drop all possible tables to create a clean slate
    await pool.query(`
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS cart CASCADE;
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS wishlist CASCADE;
      DROP TABLE IF EXISTS admin_logs CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS product CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await pool.query(schemaSql);
    
    console.log('✅ Database rebuilt successfully!');
  } catch (error) {
    console.error('❌ Error rebuilding database:', error);
  } finally {
    pool.end();
  }
}

rebuild();
