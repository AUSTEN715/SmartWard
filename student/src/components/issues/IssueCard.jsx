import React from 'react';
import { Clock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const IssueCard = ({ issue, onClick }) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH': return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      case 'MEDIUM': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      default: return <CheckCircle className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div 
      onClick={() => onClick(issue)}
      className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex items-start gap-3"
    >
      {/* Priority Indicator Dot */}
      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
        issue.priority === 'HIGH' ? 'bg-red-500' : issue.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
      }`} />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-1 mb-2">
          {issue.description || `Reported in ${issue.category}`}
        </p>

        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
           <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
             {getPriorityIcon(issue.priority)}
             {issue.category}
           </span>
           <span className="flex items-center gap-1">
             <Clock className="w-3 h-3" />
             {issue.timeAgo || new Date(issue.reportedAt).toLocaleDateString()}
           </span>
        </div>
      </div>
    </div>
  );
};