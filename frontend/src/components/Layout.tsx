import React from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PenSquare, LayoutGrid, Globe, BookOpen, Shield } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { logout, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
                                <BookOpen size={20} fill="white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                                StoryPlatform
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                            >
                                <LayoutGrid size={18} />
                                Dashboard
                            </Link>
                            <Link
                                to="/feed"
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/feed') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                            >
                                <Globe size={18} />
                                Global Feed
                            </Link>

                            {/* Admin Link - Only for Admins */}
                            {role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/admin') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                                >
                                    <Shield size={18} />
                                    Admin
                                </Link>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                to="/create"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <PenSquare size={16} />
                                Write Story
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
