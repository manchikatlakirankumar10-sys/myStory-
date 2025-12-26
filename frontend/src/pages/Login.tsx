import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            login(response.data.token, response.data.role);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
            <Toaster position="top-center" />

            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 relative z-10 transition-all">
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg transform -rotate-3">
                        <BookOpen size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium">Enter your credentials to access your workspace.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-sm text-center text-slate-500 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
