// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children, title = 'Ticket Resale Platform' }) {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on first load
    fetch('/api/init-db')
      .then(res => res.json())
      .then(data => {
        console.log('Database initialization:', data.message);
        setDbInitialized(true);
      })
      .catch(error => {
        console.error('Database initialization error:', error);
        // Still allow the app to function even if DB init fails
        setDbInitialized(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Ticket reselling platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          {/* Fixed Link component - removed nested <a> */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            TicketSwap
          </Link>
          
          {/* Fixed Link component - removed nested <a> */}
          <Link 
            href="/sell" 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Sell Tickets
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!dbInitialized ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Initializing application...</p>
          </div>
        ) : (
          children
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} TicketSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}