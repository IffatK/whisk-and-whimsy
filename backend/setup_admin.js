/**
 * setup_admin.js
 * Run once: node setup_admin.js
 * Creates all tables, seeds categories + products, and creates admin user.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const categories = [
  'Cakes & Cheesecakes',
  'Cookies & Biscuits',
  'Puddings & Custards',
  'Doughnuts & Pastries',
  'Cupcakes & Muffins',
  'Chocolates & Truffles',
  'Ice Cream & Sorbets',
];

const products = [
  { name: 'Tiramisu Delight', category: 'Cakes & Cheesecakes', price: 320, stock: 12, description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
  { name: 'Chocolate Lava Cake', category: 'Cakes & Cheesecakes', price: 280, stock: 13, description: 'Decadent chocolate cake with a gooey molten center.', image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
  { name: 'Raspberry Mousse', category: 'Puddings & Custards', price: 260, stock: 8, description: 'Light airy raspberry flavored mousse with a creamy texture.', image_url: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&q=80' },
  { name: 'Vanilla Panna Cotta', category: 'Puddings & Custards', price: 240, stock: 15, description: 'Smooth silky Italian dessert made with vanilla-infused cream.', image_url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80' },
  { name: 'Macaron Assortment', category: 'Cookies & Biscuits', price: 220, stock: 16, description: 'Delicate colorful Parisian macarons in assorted flavors.', image_url: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&q=80' },
  { name: 'Mango Sago Pudding', category: 'Puddings & Custards', price: 210, stock: 6, description: 'Tropical treat with ripe mangoes and soft sago pearls in coconut milk.', image_url: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&q=80' },
  { name: 'Blueberry Cheesecake', category: 'Cakes & Cheesecakes', price: 340, stock: 18, description: 'Classic New York-style cheesecake with blueberry compote topping.', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
  { name: 'Pistachio Baklava', category: 'Doughnuts & Pastries', price: 260, stock: 12, description: 'Flaky honey-drenched Middle Eastern pastry filled with pistachios.', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
  { name: 'Chocolate Chip Cookies', category: 'Cookies & Biscuits', price: 180, stock: 3, description: 'Golden cookies with rich semi-sweet chocolate chips. Crisp edges, chewy center.', image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80' },
  { name: 'Red Velvet Cupcakes', category: 'Cupcakes & Muffins', price: 220, stock: 14, description: 'Moist red velvet cupcakes topped with tangy cream cheese frosting.', image_url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80' },
  { name: 'Strawberry Shortcake', category: 'Cakes & Cheesecakes', price: 300, stock: 15, description: 'Fluffy shortcake layered with sweet cream and juicy strawberries.', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
  { name: 'Donut Holes', category: 'Doughnuts & Pastries', price: 160, stock: 2, description: 'Soft fluffy deep-fried dough balls coated in powdered sugar.', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
  { name: 'Chocolate Truffles', category: 'Chocolates & Truffles', price: 210, stock: 12, description: 'Decadent bite-sized truffles with silky ganache center in cocoa powder.', image_url: 'https://images.unsplash.com/photo-1511381939415-e44571b4a23f?w=400&q=80' },
  { name: 'Fruit Tart', category: 'Cakes & Cheesecakes', price: 310, stock: 13, description: 'Crisp pastry shell filled with smooth vanilla cream, topped with fresh fruits.', image_url: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&q=80' },
  { name: 'Churros', category: 'Doughnuts & Pastries', price: 190, stock: 15, description: 'Crispy fried dough sticks coated in cinnamon sugar, perfect with chocolate sauce.', image_url: 'https://images.unsplash.com/photo-1638176066496-79b3a427fb07?w=400&q=80' },
  { name: 'Chocolate Eclairs', category: 'Doughnuts & Pastries', price: 230, stock: 18, description: 'Classic French choux pastry filled with chocolate custard and chocolate glaze.', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
  { name: 'Ice Cream Sandwich', category: 'Ice Cream & Sorbets', price: 170, stock: 17, description: 'Creamy vanilla ice cream sandwiched between two chewy chocolate chip cookies.', image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
  { name: 'Carrot Cake', category: 'Cakes & Cheesecakes', price: 270, stock: 0, description: 'Moist spiced carrot cake with nuts, topped with thick cream cheese frosting.', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80', is_available: false },
  { name: 'Coconut Macaroons', category: 'Cookies & Biscuits', price: 180, stock: 12, description: 'Chewy coconut cookies lightly dipped in dark chocolate.', image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80' },
  { name: 'Mango Cheesecake', category: 'Cakes & Cheesecakes', price: 320, stock: 11, description: 'Smooth creamy cheesecake layered with sweet mango puree.', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
];

async function setup() {
  const client = await pool.connect();
  try {
    console.log('📋 Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🏗️  Creating tables...');
    await client.query(schemaSql);

    // Seed Categories
    console.log('🗂️  Seeding categories...');
    const catIdMap = {};
    for (const name of categories) {
      const res = await client.query(
        `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING category_id, name`,
        [name]
      );
      catIdMap[name] = res.rows[0].category_id;
    }

    // Seed Products
    console.log('🎂  Seeding products...');
    for (const p of products) {
      const catId = catIdMap[p.category] || null;
      await client.query(
        `INSERT INTO products (name, category_id, price, stock_quantity, description, image_url, is_available)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [p.name, catId, p.price, p.stock, p.description, p.image_url, p.is_available !== false]
      );
    }

    // Seed Admin User
    console.log('👑  Creating admin user...');
    const hashedPw = await bcrypt.hash('admin@123', 12);
    await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ('Admin', 'admin@whiskwhimsy.com', $1, 'admin')
       ON CONFLICT (email) DO UPDATE SET role = 'admin', password = $1`,
      [hashedPw]
    );

    console.log('\n✅ Database setup complete!');
    console.log('──────────────────────────────────────────');
    console.log('Admin credentials:');
    console.log('  Email:    admin@whiskwhimsy.com');
    console.log('  Password: admin@123');
    console.log('──────────────────────────────────────────');
  } catch (err) {
    console.error('❌ Setup failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
