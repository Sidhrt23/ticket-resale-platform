import { initDb } from '../../lib/server-db';

let isInitialized = false;

export default async function handler(req, res) {
  if (isInitialized) {
    return res.status(200).json({ message: 'Database already initialized' });
  }

  try {
    await initDb();
    isInitialized = true;
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ 
      message: 'Error initializing database', 
      error: error.message 
    });
  }
}