import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { IssueCard } from '../../components/issues/IssueCard';
import { AnnouncementCard } from '../../components/announcements/AnnouncementCard';
import { DetailModal } from '../../components/ui/DetailModal'; 
import { Button } from '../../components/ui/Button';
import { fetchDataFromApi } from '../../utils/apiUtils';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: 'Total Issues', value: 0, icon: FileText, color: '#3B82F6' },
    { title: 'Pending', value: 0, icon: Clock, color: '#F59E0B' },
    { title: 'Resolved', value: 0, icon: CheckCircle, color: '#10B981' },
  ]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [announcements, setAnnouncements] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(''); 

  // --- GET USER NAME ---
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentName = user.fullName ? user.fullName.split(' ')[0] : 'Student'; 

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Formatting Helpers
  const formatIssues = (list) => list.map(issue => ({
    id: issue._id,
    title: issue.title,
    category: issue.category,
    priority: issue.priority,
    status: issue.status,
    description: issue.description,
    timeAgo: new Date(issue.createdAt || issue.reportedAt).toLocaleDateString(),
    location: issue.location || `${issue.hostel?.name || 'Hostel'} - ${issue.roomNumber || ''}`,
    author: issue.reporter?.fullName
  }));

  const formatAnnouncements = (list) => list.map(item => ({
    id: item._id,
    title: item.title,
    category: item.category || 'General',
    date: new Date(item.createdAt).toLocaleDateString(),
    author: item.createdBy?.fullName || 'Admin',
    description: item.content || item.description,
    isPinned: item.isPinned
  }));

  const handleCardClick = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1. Fetch Issues
        const issuesRes = await fetchDataFromApi('/issues');
        
        if (issuesRes.success) {
          const allIssues = issuesRes.data.issues || [];
          
          // Calculate Stats
          const total = allIssues.length;
          const resolved = allIssues.filter(i => i.status === 'RESOLVED').length;
          const pending = total - resolved;

          setStats([
            { title: 'Total Issues', value: total, icon: FileText, color: '#3B82F6' },
            { title: 'Pending', value: pending, icon: Clock, color: '#F59E0B' },
            { title: 'Resolved', value: resolved, icon: CheckCircle, color: '#10B981' },
          ]);

          // Set Recent Issues (Top 4)
          setRecentIssues(formatIssues(allIssues.slice(0, 4)));
        }

        // 2. Fetch Announcements
        const annRes = await fetchDataFromApi('/announcements');
        if (annRes.success) {
           const annList = annRes.data.announcements || [];
           setAnnouncements(formatAnnouncements(annList));
        }

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                 {getGreeting()}, {studentName}! 👋
               </h1>
               <p className="text-gray-500 text-sm mt-0.5">Here's what's happening today.</p>
           </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => <StatsCard key={i} {...s} onClick={() => navigate('/issues')} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Issues List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Issues</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/issues')}>View All</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentIssues.length > 0 ? (
              recentIssues.map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onClick={() => handleCardClick(issue, 'Issue Details')} 
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No recent issues found.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Announcements List */}
        <div className="space-y-4">
           <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
           <div className="space-y-3">
             {announcements.length > 0 ? (
               announcements.slice(0, 3).map(ann => (
                 <AnnouncementCard 
                   key={ann.id} 
                   data={ann} 
                   onClick={() => handleCardClick(ann, 'Announcement')} 
                  />
               ))
             ) : (
               <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                  <span className="text-2xl block mb-2">📢</span>
                  <p className="text-gray-500 text-sm">No new updates.</p>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Floating Button */}
      <button onClick={() => navigate('/issues/new')} className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 flex items-center justify-center transition-all z-40"><Plus className="w-6 h-6" /></button>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalType}
        data={selectedItem}
      />
    </DashboardLayout>
  );
};