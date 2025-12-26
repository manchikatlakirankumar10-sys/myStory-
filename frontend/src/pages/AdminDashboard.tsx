import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, Clock, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface LoginLog {
    ID: number;
    UserID: number;
    Email: string;
    CreatedAt: string; // Login Time
}

const AdminDashboard: React.FC = () => {
    const { isAdmin } = useAuth();
    const [logs, setLogs] = useState<LoginLog[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchLogs();
    }, [isAdmin, navigate]);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/admin/logins');
            setLogs(response.data.logs || []);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Admin Header */}
            <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Shield size={20} className="text-emerald-400" />
                            Admin Console
                        </h1>
                    </div>
                    <div className="text-sm text-slate-400">
                        Restricted Access
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Recent Logins</p>
                            <p className="text-2xl font-bold">{logs.length}</p>
                        </div>
                    </div>
                    {/* Placeholder Stats */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 opacity-50">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Stories Posted</p>
                            <p className="text-2xl font-bold">--</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold">Login History</h2>
                        <button onClick={fetchLogs} className="text-sm text-blue-600 hover:underline font-medium">Refresh</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                                    <th className="px-6 py-4">User Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading records...</td>
                                    </tr>
                                )}
                                {!loading && logs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No login records found yet.</td>
                                    </tr>
                                )}
                                {logs.map((log) => (
                                    <tr key={log.ID} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {log.Email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Success
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {format(new Date(log.CreatedAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm font-mono text-right">
                                            {format(new Date(log.CreatedAt), 'hh:mm:ss a')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
