import Link from 'next/link';
import { format } from 'date-fns';

export default function EventCard({ event }) {
  // Format the date
  const formattedDate = event.date ? format(new Date(event.date), 'MMMM dd, yyyy') : 'Date not available';
  
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
      <div className="relative">
        {/* Placeholder for event image - using a gradient background */}
        <div className="h-48 bg-gradient-to-br from-purple-700 via-purple-600 to-red-600 relative">
          {/* Optional: Add a texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")' }}></div>
          
          {/* Add some event-like shapes to make it more interesting */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white opacity-5 rounded-full"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-white opacity-5 rounded-full"></div>
            <div className="absolute top-20 left-20 w-8 h-8 bg-white opacity-10 rounded-full"></div>
          </div>
        </div>
        
        {/* Ticket count badge */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-80 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full">
          {event.ticket_count || 0} tickets
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-1">{event.name}</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{event.city}</span>
          </div>
        </div>
        
        <Link 
          href={`/event/${event.id}`} 
          className="block w-full text-center py-3.5 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:from-purple-700 hover:to-red-700 transition font-semibold tracking-wide"
        >
          Buy Tickets
        </Link>
      </div>
    </div>
  );
}