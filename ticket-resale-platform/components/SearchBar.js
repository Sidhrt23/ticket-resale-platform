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
    <div className="bg-white rounded-2xl shadow-2xl mb-10 overflow-hidden">
      <form onSubmit={handleSubmit} className="md:flex">
        <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 transition text-gray-900"
              placeholder="City or zip code"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 transition text-gray-900"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
            Event
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 transition text-gray-900"
              placeholder="Artist, event, or venue"
            />
          </div>
        </div>
        
        <div className="p-4 md:p-6 flex items-end">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-xl hover:from-red-700 hover:to-purple-700 transition transform hover:scale-105 font-medium"
          >
            Find Tickets
          </button>
        </div>
      </form>
    </div>
  );
}