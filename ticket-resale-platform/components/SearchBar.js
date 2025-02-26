import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, date, name: eventName });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:space-x-4">
        <div className="flex-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City/Zip Code
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter city or zip code"
          />
        </div>
        
        <div className="flex-1">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex-1">
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter event name"
          />
        </div>
        
        <div className="self-end">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}