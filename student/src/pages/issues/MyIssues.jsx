import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { IssueCard } from '../../components/issues/IssueCard'; 
import { Button } from '../../components/ui/Button';
import { DetailModal } from '../../components/ui/DetailModal';
import { fetchDataFromApi } from '../../utils/apiUtils';

export const MyIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  const tabs = ['All', 'Pending', 'Resolved', 'Closed'];

  // Helper to format data
  const formatIssues = (data) => {
    return data.map(issue => ({
      id: issue._id,
      title: issue.title,
      category: issue.category,
      priority: issue.priority,
      status: issue.status,
      description: issue.description,
      timeAgo: new Date(issue.reportedAt || issue.createdAt).toLocaleDateString(),
      location: issue.location || `${issue.hostel?.name || 'Hostel'} - ${issue.roomNumber || ''}`,
      author: issue.reporter?.fullName || 'Me'
    }));
  };

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        // Backend filtering by reporter
        const query = user._id ? `?reporterId=${user._id}` : '';

        const response = await fetchDataFromApi(`/issues${query}`); 
        
        if (response.success) {
          const fetchedIssues = response.data.issues || [];
          setIssues(formatIssues(fetchedIssues));
        }
      } catch (error) {
        console.error("Failed to fetch issues", error);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const handleCardClick = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const filteredIssues = issues.filter(issue => {
    const status = issue.status; // Backend returns 'RESOLVED', 'CLOSED', etc.
    
    // Logic matching Backend Enums
    const matchesTab = 
      activeTab === 'All' || 
      (activeTab === 'Resolved' && status === 'RESOLVED') ||
      (activeTab === 'Closed' && status === 'CLOSED') ||
      (activeTab === 'Pending' && ['REPORTED', 'ASSIGNED', 'IN_PROGRESS'].includes(status));
      
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || issue.id.toString().includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Issues</h1>
        <Button onClick={() => navigate('/issues/new')} icon={Plus}>
          Report Issue
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                onClick={() => handleCardClick(issue)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No issues found matching your criteria.
            </div>
          )}
        </div>
      )}

      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Issue Details"
        data={selectedIssue}
      />
    </DashboardLayout>
  );
};