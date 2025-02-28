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
    <Layout title="TicketFlip | Find & Sell Event Tickets">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-white">Find Your Next </span>
            <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">Experience</span>
          </h1>
          <p className="text-gray-300 text-lg">Connect with fans selling tickets to events you love</p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-purple-600 border-t-red-600"></div>
            <p className="mt-6 text-gray-300 text-lg">Finding the best tickets for you...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-800 border-l-4 border-red-600 p-5 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block rounded-full p-6 bg-gray-800">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mt-6 text-gray-300 text-lg">No events found. Try adjusting your search.</p>
          </div>
        ) : (
          <div>
            <div className="grid md:grid-cols-3 gap-8">
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <nav className="inline-flex rounded-lg overflow-hidden shadow-lg">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-4 py-3 flex items-center ${
                      page === 1
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } transition-colors duration-200`}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages).keys()].map((i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-5 py-3 ${
                        page === i + 1
                          ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } transition-colors duration-200`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-3 flex items-center ${
                      page === totalPages
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } transition-colors duration-200`}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
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