import React, { useState, useEffect } from 'react';
import { Send, User, Loader, MessageSquare } from 'lucide-react';
import { fetchDataFromApi, postData } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast';

export const CommentSection = ({ issueId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 1. Fetch Comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        // Backend Route: GET /api/issues/:id/comments
        const response = await fetchDataFromApi(`/issues/${issueId}/comments`);
        if (response.success) {
          setComments(response.data.comments || []);
        }
      } catch (error) {
        console.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (issueId) loadComments();
  }, [issueId]);

  // 2. Add New Comment
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSending(true);
    try {
      // Backend Route: POST /api/issues/:id/comments
      const response = await postData(`/issues/${issueId}/comments`, {
        comment: newComment
      });

      if (response.success) {
        // Add new comment to list immediately (Optimistic UI)
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const addedComment = {
            _id: Date.now(), // temp ID
            comment: newComment,
            user: { fullName: currentUser.fullName || 'Me' },
            createdAt: new Date().toISOString()
        };
        
        setComments([...comments, addedComment]);
        setNewComment(''); // Clear input
      }
    } catch (error) {
      openAlertBox('Error', 'Failed to post comment');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="py-4 text-center text-gray-400 text-sm">Loading discussion...</div>;

  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" /> Discussion ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
           <p className="text-sm text-gray-500 italic">No comments yet. Be the first to reply.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <User className="w-3 h-3" /> {c.user?.fullName || 'Unknown'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()} • {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{c.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
        />
        <button 
          type="submit" 
          disabled={!newComment.trim() || sending}
          className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};