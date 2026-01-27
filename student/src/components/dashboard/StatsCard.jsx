import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ title, value, trend, trendDirection, icon: Icon, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Icon with dynamic colored background */}
        <div 
          className="p-3.5 rounded-xl transition-colors duration-300"
          style={{ backgroundColor: `${color}15`, color: color }} // 15 = 10% opacity hex
        >
          <Icon className="w-6 h-6" />
        </div>
        
        {/* Trend Pill */}
        {trend && (
          <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            trendDirection === 'up' 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {trendDirection === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};