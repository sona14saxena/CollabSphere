import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, GithubIcon, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-heading font-bold">CollabSphere</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/projects" className="px-3 py-2 text-sm font-medium hover:text-primary-light">Projects</Link>
            <Link to="/women-in-tech" className="px-3 py-2 text-sm font-medium hover:text-primary-light">Women in Tech</Link>
            
            {currentUser ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium hover:text-primary-light">Dashboard</Link>
                <Link to="/post-project" className="btn btn-primary text-sm">Post a Project</Link>
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <Link to="/profile" className="flex items-center text-sm font-medium rounded-full hover:text-primary-light">
                      <UserIcon className="h-6 w-6 mr-1" />
                      <span className="hidden lg:inline">{currentUser.displayName || 'Profile'}</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="ml-4 text-sm text-gray-400 hover:text-white flex items-center"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="hidden lg:inline ml-1">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm">Log in</Link>
                <Link to="/register" className="btn btn-primary text-sm">Sign up</Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
            >
              {isOpen ? (
                <X className="block h-6 w-6\" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6\" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background-lighter border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/projects" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Projects</Link>
            <Link to="/women-in-tech" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Women in Tech</Link>
            
            {currentUser ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Dashboard</Link>
                <Link to="/post-project" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Post a Project</Link>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-400 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Log in</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium hover:text-primary-light">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;