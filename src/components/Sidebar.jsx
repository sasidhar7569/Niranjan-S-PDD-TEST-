import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Code, PenTool, Briefcase, Target, User, LogOut, GraduationCap, Bookmark } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/home', icon: Home, label: 'Dashboard' },
    { path: '/preparation', icon: BookOpen, label: 'Preparation' },
    { path: '/coding', icon: Code, label: 'Topics Preparation' },
    { path: '/companies', icon: Briefcase, label: 'Company Prep' },
    { path: '/roadmap', icon: Briefcase, label: 'Roadmaps' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/career-tools', icon: Briefcase, label: 'Career Tools' },
    { path: '/evergreen-jobs', icon: Target, label: 'Evergreen Jobs' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-3 p-6 border-b border-slate-800">
        <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
          <GraduationCap size={24} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-textMain">PlacementPro</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-textMuted hover:bg-white/5 hover:text-textMain'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-accent hover:bg-accent/10 transition-colors"
          onClick={() => {
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('phone');
            localStorage.removeItem('profilePic');
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
