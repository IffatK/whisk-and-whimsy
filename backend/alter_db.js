import { pool } from './db/db.js';

async function updateImages() {
  await pool.query("UPDATE products SET image_url = 'https://via.placeholder.com/200?text=Cake' WHERE image_url LIKE '%example.com%'");
  console.log("Mock images updated securely!");
  pool.end();
}
updateImages();
