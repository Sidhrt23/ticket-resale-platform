// components/SellerCard.js
import { format } from 'date-fns';

export default function SellerCard({ seller, eventDate }) {
  // Format the date
  const formattedDate = eventDate ? format(new Date(eventDate), 'MMMM dd, yyyy') : 'Date not available';
  
  // Format WhatsApp link - making sure to remove any non-digits from the phone number
  const cleanPhoneNumber = seller.whatsapp ? seller.whatsapp.replace(/\D/g, '') : '';
  const whatsappLink = `https://wa.me/${cleanPhoneNumber}`;
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 relative">
      {/* Price tag - positioned as a badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold px-4 py-2 rounded-lg shadow-md">
        INR {parseFloat(seller.price).toFixed(2)}
      </div>
      
      <div className="p-6 pt-16">
        {/* Seller name with badge */}
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center text-xl font-bold text-white mr-4">
            {seller.name.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{seller.name}</h2>
            <p className="text-sm text-purple-600 font-medium">Verified Seller</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center text-gray-700">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Event Date</p>
                <p className="text-sm font-semibold">{formattedDate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center text-gray-700">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Location</p>
                <p className="text-sm font-semibold">{seller.city}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 md:col-span-2">
            <div className="flex items-center text-gray-700">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Availability</p>
                <div className="flex items-center">
                  <span className="text-sm font-semibold">{seller.tickets_available} tickets available</span>
                  {seller.tickets_available > 1 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Multiple Available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {seller.ticket_details && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 md:col-span-2">
              <div className="flex items-start text-gray-700">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Ticket Details</p>
                  <p className="text-sm font-semibold whitespace-pre-line">{seller.ticket_details}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition font-medium shadow-lg"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contact Seller on WhatsApp
        </a>
      </div>
    </div>
  );
}
