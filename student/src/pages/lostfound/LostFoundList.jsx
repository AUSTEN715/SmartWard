import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LostFoundCard } from '../../components/lostfound/LostFoundCard';
import { DetailModal } from '../../components/ui/DetailModal'; 
import { Button } from '../../components/ui/Button';
import { fetchDataFromApi } from '../../utils/apiUtils';

export const LostFoundList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lost'); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const formatItems = (data) => {
    return data.map(item => ({
      id: item._id,
      type: item.type.toLowerCase(),
      title: item.itemName, // ✅ Schema uses 'itemName'
      category: item.category,
      date: new Date(item.dateLostFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: item.location,
      image: item.imageUrl || null, // ✅ Schema uses 'imageUrl'
      description: item.description,
      author: item.reporter?.fullName || 'Anonymous' 
    }));
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetchDataFromApi('/lost-found');
        if (response.success) {
          const list = response.data.items || [];
          setItems(formatItems(list));
        }
      } catch (error) {
        console.error("Failed to load lost/found items", error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item => {
    const matchesTab = item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
            <p className="text-gray-500">Report lost items or help others find theirs.</p>
          </div>
          <Button onClick={() => navigate('/lost-found/new')} icon={Plus}>
            Report Item
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 flex mb-6 max-w-md">
          <button
            onClick={() => setActiveTab('lost')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'lost' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'found' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Found Items
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab} items...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Grid */}
        {loading ? (
           <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-blue-600 animate-spin" /></div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <LostFoundCard 
                key={item.id} 
                item={item} 
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No {activeTab} items found matching your search.</p>
          </div>
        )}
      </div>

      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'lost' ? 'Lost Item Details' : 'Found Item Details'}
        data={selectedItem}
      />
    </DashboardLayout>
  );
};