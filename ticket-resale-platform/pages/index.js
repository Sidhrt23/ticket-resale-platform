// pages/index.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';

export default function Home({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [page, setPage] = useState(1);
  const eventsPerPage = 3;
  
  // Fetch events when search params change
  useEffect(() => {
    // Skip initial load since we have server-side data
    if (Object.keys(searchParams).length === 0 && initialEvents) {
      return;
    }
    
    async function fetchEvents() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams);
        const response = await fetch(`/api/events?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, [searchParams]);
  
  // Handle search
  const handleSearch = (params) => {
    setSearchParams(params);
    setPage(1);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const displayedEvents = events.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );
  
  return (
    <Layout title="Home | Ticket Resale Platform">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Tickets</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No events found. Try adjusting your search.</p>
        </div>
      ) : (
        <div>
          <div className="grid md:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-l-md ${
                    page === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages).keys()].map((i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 ${
                      page === i + 1
                        ? 'bg-indigo-800 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-r-md ${
                    page === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

// Add server-side rendering
export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const events = await response.json();
    
    return {
      props: {
        initialEvents: events
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialEvents: []
      }
    };
  }
}