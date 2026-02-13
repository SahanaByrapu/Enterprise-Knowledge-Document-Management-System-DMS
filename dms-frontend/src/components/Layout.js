import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Search, 
  BarChart3, 
  Settings, 
  Upload, 
  LogOut, 
  User,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { path: '/', icon: Upload, label: 'Documents', exact: true },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const adminItems = [
  { path: '/admin', icon: Shield, label: 'Admin' },
];

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col h-screen sticky top-0" data-testid="sidebar">
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-900 flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold font-outfit">KnowledgeHub</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 px-3">Main</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`
              }
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mt-6 mb-3 px-3">Administration</p>
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`
                  }
                  data-testid="nav-admin"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3" data-testid="user-menu-trigger">
                <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-zinc-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900 truncate">{user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
                onClick={handleLogout}
                data-testid="logout-btn"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
};
