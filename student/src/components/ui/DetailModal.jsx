import React from 'react';
import { X, Calendar, MapPin, User, Tag, Image as ImageIcon } from 'lucide-react';
// 1. IMPORT THE NEW COMMENT SECTION COMPONENT
import { CommentSection } from '../issues/CommentSection'; 

export const DetailModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen || !data) return null;

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'unset');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
             <h2 className="text-xl font-bold text-gray-900">{title}</h2>
             {/* Show Issue ID if available (helpful for reference) */}
             {data.id && <p className="text-xs text-gray-400 mt-0.5">ID: #{data.id.slice(-6).toUpperCase()}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* 🖼️ IMAGE SECTION (Only shows if image exists) */}
          {data.image && (
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group">
              <img 
                src={data.image} 
                alt={data.title} 
                className="w-full h-auto max-h-72 object-contain mx-auto" 
              />
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Attached Image
              </div>
            </div>
          )}

          {/* Title & Badge */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
               <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                 {data.category || 'General'}
               </span>
               {data.status && (
                 <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
                   data.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-100' : 
                   data.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                   'bg-gray-50 text-gray-700 border-gray-100'
                 }`}>
                   {data.status}
                 </span>
               )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{data.title}</h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6">
            <div className="flex items-start gap-3">
               <div className="p-2 bg-white rounded-lg border border-gray-100 text-blue-500">
                 <Calendar className="w-4 h-4" />
               </div>
               <div>
                 <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</p>
                 <p className="text-sm font-semibold text-gray-900">{data.date || data.timeAgo}</p>
               </div>
            </div>

            {data.location && (
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-white rounded-lg border border-gray-100 text-red-500">
                   <MapPin className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                   <p className="text-sm font-semibold text-gray-900 line-clamp-1">{data.location}</p>
                 </div>
              </div>
            )}

            {data.author && (
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-white rounded-lg border border-gray-100 text-purple-500">
                   <User className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Reported By</p>
                   <p className="text-sm font-semibold text-gray-900">{data.author}</p>
                 </div>
              </div>
            )}
            
            {data.priority && (
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-100 text-orange-500">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Priority</p>
                    <p className="text-sm font-semibold text-gray-900">{data.priority}</p>
                  </div>
               </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-gray-400">Description</h4>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-white p-1">
              {data.description || "No additional details provided."}
            </div>
          </div>

          {/* 💬 COMMENT SECTION (Inserted Here) */}
          {/* Only show for 'Issue Details' and if we have a valid ID */}
          {title === 'Issue Details' && data.id && (
             <CommentSection issueId={data.id} />
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};