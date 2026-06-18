import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Search, User } from 'lucide-react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const WebLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');
  const [initials, setInitials] = useState('JD');

  useEffect(() => {
    const loadProfileData = () => {
      const savedPic = localStorage.getItem('profilePic');
      if (savedPic) setProfilePic(savedPic);

      const fName = localStorage.getItem('firstName');
      const lName = localStorage.getItem('lastName');
      const uName = localStorage.getItem('userName');
      
      let init = '';
      if (fName) {
        init = fName[0];
      } else if (uName) {
        const parts = uName.trim().split(' ');
        if (parts.length > 0 && parts[0]) init = parts[0][0];
      }
      
      setInitials(init ? init.toUpperCase() : 'U');
    };

    // Initial load
    loadProfileData();

    // Listen for updates from other components
    window.addEventListener('profilePicUpdated', loadProfileData);
    return () => window.removeEventListener('profilePicUpdated', loadProfileData);
  }, []);
  
  // Hide TopBar and BottomNav for intensive screens like Active Test or Code Editor
  const isFullScreenMode = location.pathname.includes('/coding/editor');

  if (isFullScreenMode) {
    return <Outlet />;
  }

  // Get Page Title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/home')) return 'Dashboard';
    if (path.includes('/preparation')) return 'Preparation';
    if (path.includes('/coding')) return 'Topics Preparation';
    if (path.includes('/companies')) return 'Company Prep';
    if (path.includes('/roadmap')) return 'Roadmaps';
    if (path.includes('/career-tools')) return 'Career Tools';
    if (path.includes('/evergreen-jobs')) return 'Evergreen Jobs';
    if (path.includes('/profile')) return 'Profile';
    return 'PlacementPro';
  };

  const showBackButton = location.pathname.split('/').filter(Boolean).length > 1 && !location.pathname.includes('/home');

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        <header className="top-bar flex justify-between items-center">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button className="icon-btn" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                <ChevronLeft size={24} />
              </button>
            )}
            <h2 className="text-xl">{getPageTitle()}</h2>
          </div>
          
          <div className="flex items-center gap-4 hidden md:flex">
            <div className="relative">
              <Search size={18} className="text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-700 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ width: '250px' }}
              />
            </div>
            <button className="relative p-2 text-secondary hover:bg-slate-700 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
              style={{ background: profilePic ? 'transparent' : 'var(--gradient-primary)' }}
              onClick={() => navigate('/profile')}
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{initials}</span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-800/80 hide-scrollbar" style={{ background: 'var(--background-color)' }}>
          <Outlet />
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
};

export default WebLayout;
