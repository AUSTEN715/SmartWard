import React from 'react';
import { Pin, Calendar, Megaphone } from 'lucide-react';

export const AnnouncementCard = ({ data, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(data)}
      className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${
        data.isPinned ? 'border-blue-200 bg-blue-50/10' : 'border-gray-200'
      }`}
    >
      {/* Pinned Icon */}
      {data.isPinned && (
        <Pin className="absolute top-3 right-3 w-3.5 h-3.5 text-blue-500 fill-current transform rotate-45" />
      )}

      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${
          data.category === 'EMERGENCY' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          <Megaphone className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{data.category}</span>
            <span className="text-[10px] text-gray-300">•</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {data.date}
            </span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
            {data.title}
          </h3>
          
          {/* CHANGED: line-clamp-2 -> truncate */}
          <p className="text-xs text-gray-500 leading-relaxed truncate">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
};