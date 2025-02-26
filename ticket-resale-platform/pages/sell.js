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
    <Layout title="Sell Tickets | Ticket Resale Platform">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sell Your Tickets</h1>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <p>Your ticket listing has been successfully created!</p>
          <p className="mt-2">Redirecting to the event page...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">What are you selling tickets for?</h2>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormType('existing')}
                className={`px-6 py-2 rounded-md ${
                  formType === 'existing'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Existing Event
              </button>
              <button
                type="button"
                onClick={() => setFormType('new')}
                className={`px-6 py-2 rounded-md ${
                  formType === 'new'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                New Event
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {formType === 'existing' ? (
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Event
                </label>
                <select
                  id="eventId"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()} - {event.city}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter event name"
                  />
                </div>
                
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="eventCity" className="block text-sm font-medium text-gray-700 mb-1">
                    Event City
                  </label>
                  <input
                    type="text"
                    id="eventCity"
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter event city"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            )}
            
            <hr className="my-6" />
            
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            
            <div>
              <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="sellerName"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price per Ticket ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter price"
              />
            </div>
            
            <div>
              <label htmlFor="sellerCity" className="block text-sm font-medium text-gray-700 mb-1">
                Your City
              </label>
              <input
                type="text"
                id="sellerCity"
                value={sellerCity}
                onChange={(e) => setSellerCity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your city"
              />
            </div>
            
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. +15551234567"
              />
              <p className="text-sm text-gray-500 mt-1">
                Include country code (e.g. +1 for USA, +44 for UK)
              </p>
            </div>
            
            <div>
              <label htmlFor="ticketsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tickets Available
              </label>
              <input
                type="number"
                id="ticketsAvailable"
                value={ticketsAvailable}
                onChange={(e) => setTicketsAvailable(e.target.value)}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-md ${
                submitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white transition`}
            >
              {submitting ? 'Submitting...' : 'List Your Tickets'}
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
}