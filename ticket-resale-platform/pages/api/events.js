// pages/api/events.js
import { query } from '../../lib/server-db';  // Use server-db instead of db

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { city, date, name, id } = req.query;
        
        let queryText = `
          SELECT e.*, COUNT(s.id) AS seller_count
          FROM events e
          LEFT JOIN sellers s ON e.id = s.event_id
        `;
        
        const queryParams = [];
        const conditions = [];
        
        if (city) {
          queryParams.push(`%${city}%`);
          conditions.push(`e.city ILIKE $${queryParams.length}`);
        }
        
        if (date) {
          queryParams.push(date);
          conditions.push(`e.date = $${queryParams.length}`);
        }
        
        if (name) {
          queryParams.push(`%${name}%`);
          conditions.push(`e.name ILIKE $${queryParams.length}`);
        }
        
        if (id) {
          queryParams.push(id);
          conditions.push(`e.id = $${queryParams.length}`);
        }
        
        if (conditions.length > 0) {
          queryText += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        queryText += ` GROUP BY e.id ORDER BY e.date`;
        
        const { rows } = await query(queryText, queryParams);
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
      }
      break;
    
    case 'POST':
      try {
        const { name, date, city, zip_code } = req.body;
        
        const { rows } = await query(
          'INSERT INTO events (name, date, city, zip_code) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, date, city, zip_code]
        );
        
        res.status(201).json(rows[0]);
      } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}