
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { MegaphoneIcon, LogOut, User, LucideIcon } from 'lucide-react';
import AdminNav from './AdminNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <MegaphoneIcon className="h-6 w-6 text-campus-primary mr-2" />
              <span className="font-bold text-xl text-campus-primary">CampusVoice</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 w-[200px]">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link 
                                to="/dashboard" 
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">My Dashboard</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  View your feedback submissions
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link 
                                to="/submit-feedback" 
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">Submit Feedback</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Create a new feedback submission
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          {user?.role === 'admin' && (
                            <li>
                              <NavigationMenuLink asChild>
                                <Link 
                                  to="/admin" 
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">Admin Dashboard</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    Access administrative controls
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          )}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        <User className="h-4 w-4 mr-2" />
                        {user?.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4">
                          <li className="row-span-3">
                            <div className="text-sm font-medium mb-2">{user?.email}</div>
                            <div className="mb-2 mt-1">
                              <span className="text-xs bg-campus-primary/10 text-campus-primary px-2 py-1 rounded">
                                {user?.role === 'admin' ? 'Administrator' : 'Student'}
                              </span>
                            </div>
                          </li>
                          <li>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={handleLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                            </Button>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Register</Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {isAuthenticated && user?.role === 'admin' && <AdminNav />}
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CampusVoice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
