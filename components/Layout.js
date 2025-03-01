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
    <div className="min-h-screen bg-black">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Ticket reselling platform" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-white flex items-center">
            <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">Ticket</span>
            <span className="text-white">Rush</span>
          </Link>
          
          <Link 
            href="/sell" 
            className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-purple-700 transition transform hover:scale-105 font-medium"
          >
            Sell Tickets
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!dbInitialized ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-red-500"></div>
            <p className="mt-2 text-gray-300">Loading the vibe...</p>
          </div>
        ) : (
          children
        )}
      </main>
      
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <p className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">Ticket</span>
                <span className="text-white">Rush</span>
              </p>
              <p className="text-gray-400 text-sm mt-2">Connecting fans since 2024</p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm2.99 4.586v1.2c.85.099 1.659.35 2.385.75.209.098.356.31.356.551 0 .339-.276.615-.615.615-.11 0-.22-.03-.317-.088-.573-.337-1.223-.564-1.909-.658v2.277c1.147.193 3.367.914 3.367 3.153 0 1.568-1.077 2.654-3.25 2.892v1.279a.615.615 0 01-1.23 0v-1.28c-1.192-.09-2.404-.438-3.435-1.025a.61.61 0 01-.322-.536c0-.338.275-.613.614-.613.107 0 .213.028.306.08.794.462 1.747.753 2.72.83v-2.528c-1.18-.196-3.35-.913-3.35-3.106 0-1.45.938-2.518 3.233-2.807v-1.195a.615.615 0 011.23 0v1.198c.847.082 1.643.326 2.369.712.216.091.367.307.367.552 0 .34-.275.616-.615.616a.62.62 0 01-.323-.09c-.575-.304-1.206-.5-1.865-.576v2.233c1.17.195 3.368.888 3.368 3.106 0 1.532-1.02 2.582-3.252 2.842v1.278a.615.615 0 01-1.23 0V18.6c-1.224-.088-2.491-.452-3.518-1.074a.608.608 0 01-.32-.534c0-.338.275-.614.615-.614.106 0 .21.026.303.078.846.497 1.784.81 2.802.896v-2.533c-1.183-.2-3.367-.936-3.367-3.11 0-1.52.968-2.62 3.25-2.89V7.3c0-.34.276-.614.615-.614.34 0 .615.275.615.614v1.2c.868.088 1.687.33 2.427.717.214.094.364.31.364.553 0 .339-.275.614-.615.614a.617.617 0 01-.321-.09c-.59-.302-1.241-.498-1.927-.576v2.195z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.689-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184A4.92 4.92 0 0011.9 8.035a14.03 14.03 0 01-10.13-5.147c-.637 1.098-.3 2.526.756 3.250-.398-.013-.782-.122-1.123-.308a4.935 4.935 0 003.95 4.87 4.936 4.936 0 01-2.225.084 4.93 4.93 0 004.597 3.422A9.905 9.905 0 010 17.25a14.009 14.009 0 007.605 2.215c9.125 0 14.122-7.563 14.122-14.123 0-.215-.004-.43-.013-.645a10.43 10.43 0 002.247-2.613z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} TicketFlip. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #000000;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
