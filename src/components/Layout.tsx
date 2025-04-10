
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Home, 
  LogIn, 
  UserPlus, 
  LogOut, 
  BarChart,
  PlusCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-campus-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <MessageSquare className="h-6 w-6" />
            <span>CampusVoice</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline-block text-sm font-medium">
                  Welcome, {user?.name} ({user?.role})
                </span>
                <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-white/20">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            <Button
              asChild
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              className="my-2"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            {isAuthenticated && (
              <>
                <Button
                  asChild
                  variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  className="my-2"
                >
                  <Link to="/dashboard">
                    <BarChart className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant={location.pathname === '/submit-feedback' ? 'default' : 'ghost'}
                  size="sm"
                  className="my-2"
                >
                  <Link to="/submit-feedback">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} CampusVoice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
