// pages/api/sellers.js
import { query } from '../../lib/server-db';  // Use server-db instead of db

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { event_id } = req.query;
        
        if (!event_id) {
          return res.status(400).json({ message: 'Event ID is required' });
        }
        
        const { rows } = await query(
          'SELECT * FROM sellers WHERE event_id = $1 ORDER BY price ASC',
          [event_id]
        );
        
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        res.status(500).json({ message: 'Error fetching sellers' });
      }
      break;
    
    case 'POST':
      try {
        const { event_id, name, price, city, whatsapp, tickets_available } = req.body;
        
        const { rows } = await query(
          'INSERT INTO sellers (event_id, name, price, city, whatsapp, tickets_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [event_id, name, price, city, whatsapp, tickets_available || 1]
        );
        
        res.status(201).json(rows[0]);
      } catch (error) {
        console.error('Error creating seller:', error);
        res.status(500).json({ message: 'Error creating seller' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}