import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function SellTicket() {
  const router = useRouter();
  
  const [formType, setFormType] = useState('existing');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form states for seller
  const [eventId, setEventId] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [price, setPrice] = useState('');
  const [sellerCity, setSellerCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState(1);
  const [ticketDetails, setTicketDetails] = useState('');
  
  // Form states for new event
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Fetch events for the dropdown
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        
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
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      let currentEventId = eventId;
      
      // If creating a new event, submit event first
      if (formType === 'new') {
        const eventResponse = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: eventName,
            date: eventDate,
            city: eventCity,
            zip_code: zipCode,
          }),
        });
        
        if (!eventResponse.ok) {
          throw new Error('Failed to create event');
        }
        
        const eventData = await eventResponse.json();
        currentEventId = eventData.id;
      }
      
      // Submit seller data
      const sellerResponse = await fetch('/api/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: currentEventId,
          name: sellerName,
          price: parseFloat(price),
          city: sellerCity,
          whatsapp,
          tickets_available: parseInt(ticketsAvailable),
          ticket_details: ticketDetails
        }),
      });
      
      if (!sellerResponse.ok) {
        throw new Error('Failed to create seller listing');
      }
      
      setSuccess(true);
      
      // Redirect to the event page after a short delay
      setTimeout(() => {
        router.push(`/event/${currentEventId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Layout title="Sell Tickets | TicketFlip">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">Sell Your Tickets</span>
          </h1>
          <p className="text-gray-300 text-lg">Connect with fans looking for tickets to your event</p>
        </div>
        
        {success ? (
          <div className="bg-gradient-to-r from-green-900 to-green-800 p-8 rounded-2xl mb-6 animate-pulse shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-400 rounded-full p-2">
                <svg className="h-8 w-8 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-green-100">Success!</h3>
                <p className="text-green-200 mt-2">Your ticket listing has been successfully created!</p>
                <p className="text-green-300 mt-1">Redirecting to the event page...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl shadow-2xl border border-gray-800">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-6 text-white">What are you selling tickets for?</h2>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormType('existing')}
                  className={`px-6 py-3 rounded-xl transition transform hover:scale-105 ${
                    formType === 'existing'
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Existing Event
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('new')}
                  className={`px-6 py-3 rounded-xl transition transform hover:scale-105 ${
                    formType === 'new'
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  New Event
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-900 bg-opacity-50 border-l-4 border-red-500 p-4 rounded-xl mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {formType === 'existing' ? (
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
                  <label htmlFor="eventId" className="block text-sm font-medium text-gray-300 mb-2">
                    Select Event
                  </label>
                  <div className="relative">
                    <select
                      id="eventId"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      required
                      className="block w-full pl-4 pr-10 py-3 bg-gray-700 border-0 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      <option value="">Select an event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name} - {new Date(event.date).toLocaleDateString()} - {event.city}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-300 mb-2">
                      Event Name
                    </label>
                    <input
                      type="text"
                      id="eventName"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Enter event name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="eventCity" className="block text-sm font-medium text-gray-300 mb-2">
                      Event City
                    </label>
                    <input
                      type="text"
                      id="eventCity"
                      value={eventCity}
                      onChange={(e) => setEventCity(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Enter event city"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">
                      Zip Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Enter zip code"
                    />
                  </div>
                </div>
              )}
              
              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 py-1 bg-gradient-to-r from-red-600 to-purple-600 text-white text-sm font-medium rounded-full">Your Details</span>
                </div>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="sellerName" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="sellerName"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                    Price per Ticket (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400">₹</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0.01"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sellerCity" className="block text-sm font-medium text-gray-300 mb-2">
                    Your City
                  </label>
                  <input
                    type="text"
                    id="sellerCity"
                    value={sellerCity}
                    onChange={(e) => setSellerCity(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-2">
                    WhatsApp Number (with country code)
                  </label>
                  <input
                    type="text"
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="e.g. +15551234567"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Include country code (e.g. +1 for USA, +44 for UK)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="ticketsAvailable" className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Tickets Available
                  </label>
                  <input
                    type="number"
                    id="ticketsAvailable"
                    value={ticketsAvailable}
                    onChange={(e) => setTicketsAvailable(e.target.value)}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="ticketDetails" className="block text-sm font-medium text-gray-300 mb-2">
                    Ticket Details (section, row, seat type, etc.)
                  </label>
                  <textarea
                    id="ticketDetails"
                    value={ticketDetails}
                    onChange={(e) => setTicketDetails(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border-0 text-white rounded-xl focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Enter details about the tickets (e.g., Section A, Row 3, VIP access, etc.)"
                    rows="3"
                  ></textarea>
                  <p className="text-sm text-gray-400 mt-2">
                    Provide details about seat location, ticket type, and any special features.
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-medium text-lg shadow-xl transition transform hover:scale-105 ${
                  submitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'List Your Tickets'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
