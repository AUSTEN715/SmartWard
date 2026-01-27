import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { IssueCard } from '../../components/issues/IssueCard';
import { Button } from '../../components/ui/Button';
import { fetchDataFromApi } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast'; // Added Toast

export const MyIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const tabs = ['All', 'Pending', 'Resolved', 'Closed'];

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const response = await fetchDataFromApi('/issues'); 
        
        if (response.success && response.data) {
          setIssues(response.data.issues);
        } else {
          // Optional: Show error if fetch fails specifically
          // openAlertBox('Error', "Could not load issues.");
        }
      } catch (error) {
        console.error("Error loading issues:", error);
        openAlertBox('Error', "Network error while loading issues.");
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesTab = activeTab === 'All' || issue.status === activeTab || (activeTab === 'Pending' && ['Reported', 'Assigned', 'In Progress'].includes(issue.status));
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || issue._id.toString().includes(searchTerm);
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
              <IssueCard key={issue._id} issue={issue} onClick={() => {}} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No issues found matching your criteria.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};