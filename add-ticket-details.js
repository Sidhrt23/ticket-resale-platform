// Migration script to add ticket_details column
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addTicketDetailsColumn() {
  try {
    console.log('Adding ticket_details column to sellers table...');
    
    // Check if column already exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sellers' AND column_name = 'ticket_details'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('Column ticket_details already exists, skipping migration.');
    } else {
      // Add the ticket_details column
      await pool.query(`
        ALTER TABLE sellers
        ADD COLUMN ticket_details TEXT
      `);
      console.log('Successfully added ticket_details column to sellers table.');
    }
  } catch (error) {
    console.error('Error adding ticket_details column:', error);
  } finally {
    await pool.end();
  }
}

// Run the migration
addTicketDetailsColumn(); 