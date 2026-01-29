// src/utils/dummyData.js

export const DUMMY_DASHBOARD_STATS = {
  totalIssues: 12,
  pendingIssues: 4,
  resolvedIssues: 8
};

export const DUMMY_RECENT_ISSUES = [
  {
    _id: '1',
    title: 'Leaking Tap in Washroom',
    category: 'PLUMBING',
    priority: 'HIGH',
    status: 'REPORTED',
    description: "Water supply will be shut down tomorrow from 10 AM to 2 PM for tank cleaning. Please store water accordingly. ",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    _id: '2',
    title: 'Ceiling Fan Making Noise',
    category: 'ELECTRICAL',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    _id: '3',
    title: 'Study Table Broken',
    category: 'FURNITURE',
    priority: 'LOW',
    status: 'RESOLVED',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  }
];

export const DUMMY_ANNOUNCEMENTS = [
  {
    _id: '1',
    title: '🚨 Urgent: Water Supply Maintenance',
    content: 'Water supply will be shut down tomorrow from 10 AM to 2 PM for tank cleaning. Please store water accordingly.',
    category: 'MAINTENANCE',
    isPinned: true,
    createdAt: new Date().toISOString(),
    createdBy: { fullName: 'Warden Smith' }
  },
  {
    _id: '2',
    title: '🎉 Hostel Night 2026',
    content: 'Get ready for the biggest event of the year! Join us at the auditorium this Saturday at 6 PM.',
    category: 'EVENT',
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: { fullName: 'Student Council' }
  },
  {
    _id: '3',
    title: 'Mess Menu Update',
    content: 'Based on feedback, Tuesday breakfast is now Idli Sambar instead of Upma.',
    category: 'FOOD',
    isPinned: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: { fullName: 'Mess Committee' }
  }
];
// src/utils/dummyData.js

export const DUMMY_LOST_FOUND = [
  {
    _id: '1',
    type: 'LOST',
    itemName: 'iPhone 13 - Blue Case',
    category: 'ELECTRONICS',
    // 📸 Paste Link #1 Here:
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
    dateLostFound: new Date().toISOString(),
    location: 'Library 2nd Floor',
    description: 'Lost it while studying. Has a sticker on the back.',
    reporter: { fullName: 'John Doe' },
    status: 'OPEN'
  },
  {
    _id: '2',
    type: 'FOUND',
    itemName: 'Smart Watch',
    category: 'ELECTRONICS',
    // 📸 Paste Link #2 Here:
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    dateLostFound: new Date(Date.now() - 86400000).toISOString(),
    location: 'Canteen Table 4',
    description: 'Found this watch left on the table.',
    reporter: { fullName: 'Jane Smith' },
    status: 'OPEN'
  },
  {
    _id: '3',
    type: 'FOUND',
    itemName: 'Black Umbrella',
    category: 'OTHERS',
    // 📸 Paste Link #3 Here:
    image: 'https://images.unsplash.com/photo-1683739545527-5f7b153ff75a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dateLostFound: new Date(Date.now() - 172800000).toISOString(),
    location: 'Main Gate Security',
    description: 'Submitted to security guard.',
    reporter: { fullName: 'Security' },
    status: 'CLAIMED'
  }
];