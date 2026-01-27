import React from 'react';
import { Calendar, User, Pin, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const AnnouncementCard = ({ data }) => {
  const categoryColors = {
    Maintenance: 'warning',
    Event: 'primary',
    Emergency: 'danger',
    General: 'default',
    Food: 'success'
  };

  return (
    <div className={`bg-white rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${
      data.isPinned ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <Badge variant={categoryColors[data.category] || 'default'} size="sm">
            {data.category}
          </Badge>
          {data.isPinned && (
            <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              <Pin className="w-3 h-3 mr-1 fill-current" /> Pinned
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {data.date}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{data.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
        {data.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-600 font-bold">
            {data.author[0]}
          </div>
          <span>Posted by <span className="font-medium text-gray-700">{data.author}</span></span>
        </div>
        
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center group">
          Read More 
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};