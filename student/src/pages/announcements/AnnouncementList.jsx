import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AnnouncementCard } from '../../components/announcements/AnnouncementCard';
import { fetchDataFromApi } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast';

export const AnnouncementList = () => {
  const [filter, setFilter] = useState('All');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetchDataFromApi('/announcements');
        if (response.success && response.data) {
          // Map backend data to match your UI structure
          const formattedData = response.data.announcements.map(item => ({
            id: item._id,
            title: item.title,
            category: item.category || 'General',
            date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: item.createdBy?.fullName || 'Admin',
            description: item.content, // Assuming content is plain text. If HTML, use dangerouslySetInnerHTML in Card.
            isPinned: item.isPinned
          }));
          setAnnouncements(formattedData);
        }
      } catch (error) {
        console.error(error);
        openAlertBox('Error', "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  // Filter Logic
  const filteredAnnouncements = announcements.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter.toUpperCase();
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-500">Stay updated with the latest news from the hostel.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search updates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {['All', 'Emergency', 'Maintenance', 'Event', 'Food'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-blue-600 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((item) => (
                <AnnouncementCard key={item.id} data={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">No announcements found.</div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};