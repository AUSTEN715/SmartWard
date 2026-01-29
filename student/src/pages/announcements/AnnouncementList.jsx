import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader, XCircle, Check } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AnnouncementCard } from '../../components/announcements/AnnouncementCard';
import { DetailModal } from '../../components/ui/DetailModal'; 
import { fetchDataFromApi } from '../../utils/apiUtils';

export const AnnouncementList = () => {
  const [filter, setFilter] = useState('All');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const categories = ['All', 'Emergency', 'Maintenance', 'Event', 'Food', 'General'];

  const formatAnnouncements = (data) => {
    return data.map(item => ({
      id: item._id,
      title: item.title,
      category: (item.category || 'GENERAL').toUpperCase(), 
      date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: item.createdBy?.fullName || 'Admin',
      description: item.content, // ✅ Schema uses 'content'
      isPinned: item.isPinned
    }));
  };

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetchDataFromApi('/announcements');
        if (response.success && response.data) {
          const list = response.data.announcements || [];
          setAnnouncements(formatAnnouncements(list));
        }
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  const handleCardClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleFilterSelect = (category) => {
    setFilter(category);
    setIsDropdownOpen(false);
  };

  const filteredAnnouncements = announcements.filter(item => {
    const itemCat = item.category.toUpperCase(); 
    const filterCat = filter.toUpperCase();
    const matchesCategory = filter === 'All' || itemCat === filterCat;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(searchLower) || 
      item.description.toLowerCase().includes(searchLower);

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
          
          <div className="flex gap-3 w-full md:w-auto relative">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search updates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow focus:shadow-sm"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full md:w-auto justify-between gap-2 ${
                  isDropdownOpen || filter !== 'All'
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" /> 
                  <span>{filter === 'All' ? 'Filter' : filter}</span>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select Category
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleFilterSelect(cat)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        filter === cat ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {cat}
                      {filter === cat && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)} />
        )}

        {loading ? (
           <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-blue-600 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((item) => (
                <AnnouncementCard 
                  key={item.id} 
                  data={item} 
                  onClick={() => handleCardClick(item)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                   <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                <p className="text-gray-500 text-sm mt-1">We couldn't find anything matching your search.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilter('All'); }}
                  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <XCircle className="w-4 h-4" /> Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Announcement"
        data={selectedAnnouncement}
      />
    </DashboardLayout>
  );
};