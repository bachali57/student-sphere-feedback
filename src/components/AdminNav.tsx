
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { LayoutDashboard, MessageSquare, Users, Settings, BarChart } from 'lucide-react';

const AdminNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  const navItems = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      name: 'All Feedback',
      href: '/dashboard',
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart className="h-4 w-4 mr-2" />,
      disabled: true,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <Users className="h-4 w-4 mr-2" />,
      disabled: true,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      disabled: true,
    },
  ];

  return (
    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
      <h2 className="font-medium text-sm text-indigo-800 mb-3">Admin Navigation</h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                isActive
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                }
              }}
              aria-disabled={item.disabled}
            >
              {item.icon}
              {item.name}
              {item.disabled && (
                <span className="ml-auto text-xs bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminNav;
