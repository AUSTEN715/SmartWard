import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus, Calendar, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { IssueCard } from '../../components/issues/IssueCard';
import { Button } from '../../components/ui/Button';
import { fetchDataFromApi } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast'; // Added Toast

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetchDataFromApi('/dashboard/student');

        if (response.success && response.data) {
          const { stats: apiStats, myIssues } = response.data;

          setStats([
            { title: 'Total Issues', value: apiStats.totalIssues, icon: FileText, color: '#3B82F6' },
            { title: 'Pending', value: apiStats.pendingIssues, icon: Clock, color: '#F59E0B' },
            { title: 'Resolved', value: apiStats.resolvedIssues, icon: CheckCircle, color: '#10B981' },
          ]);

          setRecentIssues(myIssues.map(issue => ({
              id: issue._id,
              title: issue.title,
              category: issue.category,
              priority: issue.priority,
              status: issue.status,
              timeAgo: new Date(issue.reportedAt).toLocaleDateString(),
              icon: '🔧' 
          })));
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
        openAlertBox('Error', "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
               <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{getGreeting()}, John! 👋</h1>
               <p className="text-gray-500 mt-1 text-lg">Here's what's happening in your hostel today.</p>
           </div>
           <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
               <Calendar className="w-4 h-4 text-blue-500" />
               {today}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.length > 0 ? (
          stats.map((s, i) => <StatsCard key={i} {...s} onClick={() => navigate('/issues')} />)
        ) : (
          <div className="col-span-3 text-center py-4 text-gray-500">No stats available</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Issues */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Issues</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => navigate('/issues')}>
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentIssues.length > 0 ? (
              recentIssues.map(issue => <IssueCard key={issue.id} issue={issue} onClick={() => console.log(issue.id)} />)
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No recent issues found.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Announcements */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
           
           <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center h-[340px] flex flex-col items-center justify-center group hover:shadow-md transition-all">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📢</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">No new updates</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-[200px]">
                Everything looks quiet today. Check back later for updates from the warden.
              </p>
              <Button variant="outline" size="sm" className="mt-6">Archive</Button>
           </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/issues/new')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 flex items-center justify-center transition-all z-50"
      >
        <Plus className="w-7 h-7" />
      </button>
    </DashboardLayout>
  );
};