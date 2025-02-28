import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
export async function initDb() {
  try {
    console.log("Starting database initialization...");
    
    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        city VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("Events table created");

    // Create sellers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        city VARCHAR(100) NOT NULL,
        whatsapp VARCHAR(20) NOT NULL,
        tickets_available INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("Sellers table created");
    console.log('Database initialized successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Rethrow to be caught by caller
  }
}

// Query function
export const query = (text, params) => pool.query(text, params);