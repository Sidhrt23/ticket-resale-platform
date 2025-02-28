import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SellerCard from '../../components/SellerCard';
import Link from 'next/link';

export default function EventDetail({ event, sellers, error }) {
  const router = useRouter();
  
  // If the page is still generating via SSR
  if (router.isFallback) {
    return (
      <Layout title="Loading... | Ticket Resale Platform">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading event details...</p>
        </div>
      </Layout>
    );
  }
  
  // If there was an error
  if (error) {
    return (
      <Layout title="Error | Ticket Resale Platform">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </Layout>
    );
  }
  
  // If event not found
  if (!event) {
    return (
      <Layout title="Not Found | Ticket Resale Platform">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          Event not found.
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${event.name} | Ticket Resale Platform`}>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
        <div className="flex flex-wrap gap-6 mb-4">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric',
              month: 'long', 
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.city}{event.zip_code ? `, ${event.zip_code}` : ''}</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Sellers</h2>
      
      {sellers.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative">
          <p>No sellers available for this event yet.</p>
          <p className="mt-2">
            {/* Updated Link component - removed nested <a> tag */}
            <Link 
              href="/sell" 
              className="text-indigo-600 hover:text-indigo-800"
            >
              Be the first to sell tickets for this event!
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} eventDate={event.date} />
          ))}
        </div>
      )}
    </Layout>
  );
}

// Replace the getServerSideProps function with this:
export async function getServerSideProps({ params }) {
  try {
    // Import the database connection directly
    const { pool } = await import('../../lib/db');
    
    // Query event details directly
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [params.id]);
    
    if (eventResult.rows.length === 0) {
      return {
        props: {
          event: null,
          sellers: [],
          error: 'Event not found'
        }
      };
    }
    
    // Query sellers directly
    const sellersResult = await pool.query('SELECT * FROM sellers WHERE event_id = $1', [params.id]);
    
    // Serialize for Next.js props
    const event = JSON.parse(JSON.stringify(eventResult.rows[0]));
    const sellers = JSON.parse(JSON.stringify(sellersResult.rows));
    
    return {
      props: {
        event,
        sellers,
        error: null
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        event: null,
        sellers: [],
        error: 'Failed to fetch event data'
      }
    };
  }
}