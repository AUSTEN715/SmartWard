import React from 'react';
import { MapPin, Image as ImageIcon } from 'lucide-react';

export const LostFoundCard = ({ item, onClick }) => {
  const isLost = item.type === 'lost';

  return (
    <div 
      onClick={() => {
        console.log("Card Clicked!", item.title); // Debugging Log
        if (onClick) onClick(item);
      }}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex h-28 relative z-0"
    >
      {/* Small Left Image */}
      <div className="w-28 h-full bg-gray-100 relative flex-shrink-0">
        <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold z-10 ${
          isLost ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {isLost ? 'LOST' : 'FOUND'}
        </div>
        
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{item.category}</span>
        
        <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
          {item.title}
        </h3>

        <div className="flex items-center text-[11px] text-gray-500 mt-auto">
          <MapPin className="w-3 h-3 mr-1 text-blue-500" />
          <span className="truncate">{item.location}</span>
        </div>
        <span className="text-[10px] text-gray-400 mt-1">{item.date}</span>
      </div>
    </div>
  );
};