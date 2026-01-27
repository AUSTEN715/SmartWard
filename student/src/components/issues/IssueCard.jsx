import React from 'react';
import { Badge } from '../ui/Badge';
import { Clock, ChevronRight, AlertCircle } from 'lucide-react';

export const IssueCard = ({ issue, onClick }) => {
  const priorityColors = {
    Emergency: 'danger',
    High: 'danger',
    Medium: 'warning',
    Low: 'success'
  };
  
  const statusColors = {
    Reported: 'warning',
    Assigned: 'primary',
    'In Progress': 'info',
    Resolved: 'success',
    Closed: 'default'
  };
  
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-4"
    >
      {/* Icon Box */}
      <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:scale-105 transition-all flex-shrink-0">
        {issue.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center flex-shrink-0">
            <Clock className="w-3 h-3 mr-1" />
            {issue.timeAgo}
          </span>
        </div>
        
        <div className="flex items-center flex-wrap gap-2 mt-1.5">
          <span className="text-xs font-medium text-gray-500">#{issue.id}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{issue.category}</span>
          
          <span className="text-gray-300">•</span>
          
          {/* PRIORITY BADGE (Restored) */}
          <Badge variant={priorityColors[issue.priority]} size="sm">
            {issue.priority}
          </Badge>

          <div className="flex-1"></div>
          
          {/* STATUS BADGE */}
          <Badge variant={statusColors[issue.status]} size="sm">
            {issue.status}
          </Badge>
        </div>
      </div>
      
      {/* Arrow Icon */}
      <div className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all pl-2">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};