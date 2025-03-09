// Database management utility script
require('dotenv').config();
const { Pool } = require('pg');
const readline = require('readline');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to execute queries
async function executeQuery(query, params = []) {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result;
  } catch (err) {
    console.error('Error executing query:', err.message);
    throw err;
  } finally {
    if (client) client.release();
  }
}

// Main menu
async function showMenu() {
  console.log('\n=== DATABASE MANAGEMENT TOOL ===');
  console.log('1. View all events');
  console.log('2. View all sellers');
  console.log('3. Add new event');
  console.log('4. Add new seller');
  console.log('5. Search events');
  console.log('6. Search sellers');
  console.log('7. View table structure');
  console.log('8. Exit');
  
  rl.question('\nEnter option (1-8): ', async (answer) => {
    switch(answer) {
      case '1':
        await viewAllEvents();
        break;
      case '2':
        await viewAllSellers();
        break;
      case '3':
        await addNewEvent();
        break;
      case '4':
        await addNewSeller();
        break;
      case '5':
        await searchEvents();
        break;
      case '6':
        await searchSellers();
        break;
      case '7':
        await viewTableStructure();
        break;
      case '8':
        console.log('Exiting program...');
        await pool.end();
        rl.close();
        return;
      default:
        console.log('Invalid option. Please try again.');
        showMenu();
        return;
    }
  });
}

// View all events
async function viewAllEvents() {
  try {
    const result = await executeQuery('SELECT * FROM events ORDER BY id');
    console.log('\n=== ALL EVENTS ===');
    if (result.rows.length === 0) {
      console.log('No events found.');
    } else {
      console.table(result.rows);
    }
  } catch (err) {
    // Error is already logged in executeQuery
  } finally {
    showMenu();
  }
}

// View all sellers
async function viewAllSellers() {
  try {
    const result = await executeQuery(`
      SELECT s.*, e.name as event_name 
      FROM sellers s
      LEFT JOIN events e ON s.event_id = e.id
      ORDER BY s.id
    `);
    console.log('\n=== ALL SELLERS ===');
    if (result.rows.length === 0) {
      console.log('No sellers found.');
    } else {
      console.table(result.rows);
    }
  } catch (err) {
    // Error is already logged in executeQuery
  } finally {
    showMenu();
  }
}

// Add new event
async function addNewEvent() {
  rl.question('\nEvent name: ', (name) => {
    rl.question('Date (YYYY-MM-DD): ', (date) => {
      rl.question('City: ', (city) => {
        rl.question('Zip code (optional): ', async (zipCode) => {
          try {
            const result = await executeQuery(
              'INSERT INTO events(name, date, city, zip_code) VALUES($1, $2, $3, $4) RETURNING *',
              [name, date, city, zipCode || null]
            );
            console.log('\nEvent added successfully:');
            console.table(result.rows);
          } catch (err) {
            // Error is already logged in executeQuery
          } finally {
            showMenu();
          }
        });
      });
    });
  });
}

// Add new seller
async function addNewSeller() {
  // First get all events for reference
  try {
    const events = await executeQuery('SELECT id, name FROM events ORDER BY id');
    console.log('\n=== AVAILABLE EVENTS ===');
    if (events.rows.length === 0) {
      console.log('No events found. Please add an event first.');
      showMenu();
      return;
    }
    
    console.table(events.rows);
    
    rl.question('\nEvent ID: ', (eventId) => {
      rl.question('Seller name: ', (name) => {
        rl.question('Price: ', (price) => {
          rl.question('City: ', (city) => {
            rl.question('WhatsApp: ', (whatsapp) => {
              rl.question('Tickets available: ', async (ticketsAvailable) => {
                try {
                  const result = await executeQuery(
                    'INSERT INTO sellers(event_id, name, price, city, whatsapp, tickets_available) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
                    [eventId, name, price, city, whatsapp, ticketsAvailable || 1]
                  );
                  console.log('\nSeller added successfully:');
                  console.table(result.rows);
                } catch (err) {
                  // Error is already logged in executeQuery
                } finally {
                  showMenu();
                }
              });
            });
          });
        });
      });
    });
  } catch (err) {
    // Error is already logged in executeQuery
    showMenu();
  }
}

// Search events
async function searchEvents() {
  rl.question('\nSearch term (name, city): ', async (term) => {
    try {
      const result = await executeQuery(
        'SELECT * FROM events WHERE name ILIKE $1 OR city ILIKE $1 ORDER BY id',
        [`%${term}%`]
      );
      console.log('\n=== SEARCH RESULTS ===');
      if (result.rows.length === 0) {
        console.log('No events found matching your search.');
      } else {
        console.table(result.rows);
      }
    } catch (err) {
      // Error is already logged in executeQuery
    } finally {
      showMenu();
    }
  });
}

// Search sellers
async function searchSellers() {
  rl.question('\nSearch term (name, city, event name): ', async (term) => {
    try {
      const result = await executeQuery(`
        SELECT s.*, e.name as event_name 
        FROM sellers s
        LEFT JOIN events e ON s.event_id = e.id
        WHERE s.name ILIKE $1 OR s.city ILIKE $1 OR e.name ILIKE $1
        ORDER BY s.id
      `, [`%${term}%`]);
      
      console.log('\n=== SEARCH RESULTS ===');
      if (result.rows.length === 0) {
        console.log('No sellers found matching your search.');
      } else {
        console.table(result.rows);
      }
    } catch (err) {
      // Error is already logged in executeQuery
    } finally {
      showMenu();
    }
  });
}

// View table structure
async function viewTableStructure() {
  rl.question('\nWhich table (events, sellers): ', async (table) => {
    if (table !== 'events' && table !== 'sellers') {
      console.log('Invalid table name. Please enter "events" or "sellers".');
      showMenu();
      return;
    }
    
    try {
      const result = await executeQuery(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      console.log(`\n=== ${table.toUpperCase()} TABLE STRUCTURE ===`);
      console.table(result.rows);
    } catch (err) {
      // Error is already logged in executeQuery
    } finally {
      showMenu();
    }
  });
}

// Start the program
console.log('Connecting to database...');
pool.connect()
  .then(() => {
    console.log('Database connection established.');
    showMenu();
  })
  .catch(err => {
    console.error('Failed to connect to database:', err.message);
    pool.end();
    rl.close();
  });

// Handle program termination
process.on('SIGINT', async () => {
  console.log('\nClosing database connection...');
  await pool.end();
  rl.close();
  console.log('Goodbye!');
  process.exit(0);
}); 