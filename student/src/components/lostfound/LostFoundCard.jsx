import React from 'react';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const LostFoundCard = ({ item }) => {
  const isLost = item.type === 'lost';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      {/* Image Area */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img 
          src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={isLost ? 'danger' : 'success'} className="shadow-sm backdrop-blur-md bg-opacity-90">
            {isLost ? '🔴 Lost' : '🟢 Found'}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <button className={`mt-auto w-full py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
          isLost 
            ? 'border-red-100 text-red-600 hover:bg-red-50' 
            : 'border-green-100 text-green-600 hover:bg-green-50'
        }`}>
          {isLost ? 'I Found This' : 'This is Mine'}
        </button>
      </div>
    </div>
  );
};