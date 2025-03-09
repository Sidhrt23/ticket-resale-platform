// Simple script to test database connection
require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('Connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT current_timestamp as time');
    console.log('Current database time:', result.rows[0].time);
    
    // List existing tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nExisting tables:');
    if (tables.rows.length === 0) {
      console.log('No tables found. Database is empty.');
    } else {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection(); 