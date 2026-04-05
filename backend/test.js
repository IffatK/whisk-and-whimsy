const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://whiskandwhimsy:whiskandwhimsy%40123@db.eniriyzmymueytrxadps.supabase.co:5432/postgres",
});
client.connect()
  .then(() => console.log('Connected successfully!'))
  .catch(err => console.error('Connection error', err.stack));