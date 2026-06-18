import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, PenTool, Briefcase, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/preparation', icon: BookOpen, label: 'Prep' },
    { path: '/roadmap', icon: Briefcase, label: 'Roadmap' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-textMuted hover:text-textMain'
              }`
            }
          >
            <Icon size={24} className="transition-transform duration-200" style={{ transform: 'translateY(-2px)' }} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
