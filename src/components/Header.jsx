import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              جيش ريسبكت
            </h1>
          </Link>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  className="gap-2 border-slate-600 bg-slate-800/50 text-white hover:bg-slate-700 hover:border-purple-500"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Button>
                <Button
                  onClick={handleLogout}
                  className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل خروج
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;