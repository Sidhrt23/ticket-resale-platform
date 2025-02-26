// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize database via API instead of direct import
    fetch('/api/init-db')
      .then(res => res.json())
      .then(data => console.log('Database initialization:', data.message))
      .catch(error => console.error('Database initialization error:', error));
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;