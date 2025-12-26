import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Book, Clock, Globe, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Story {
    ID: number;
    CreatedAt: string;
    Title: string;
    Content: string;
    IsPublic: boolean;
}

const Dashboard: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await api.get('/stories/my');
            setStories(response.data.stories || []);
        } catch (error) {
            console.error('Failed to fetch stories', error);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Stories</h1>
                    <p className="mt-1 text-slate-500 font-medium">Manage and share your personal library.</p>
                </div>
                <Link to="/create" className="sm:hidden flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg">
                    <Plus size={20} />
                </Link>
            </div>

            {stories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
                    <div className="p-4 mb-6 bg-blue-50 rounded-full text-blue-500">
                        <Book size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No stories written yet</h3>
                    <p className="max-w-md mt-2 text-slate-500">Your journey begins with a single word. Start writing your first story to share with the world.</p>
                    <Link to="/create" className="mt-8 flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow hover:shadow-lg hover:-translate-y-0.5">
                        <Plus size={18} />
                        Create New Story
                    </Link>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {stories.map((story) => (
                        <motion.div
                            key={story.ID}
                            variants={item}
                            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md ${story.IsPublic ? 'bg-emerald-100/90 text-emerald-700' : 'bg-slate-100/90 text-slate-600'}`}>
                                    {story.IsPublic ? <Globe size={10} /> : <Lock size={10} />}
                                    {story.IsPublic ? 'Public' : 'Private'}
                                </span>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4">
                                    <Clock size={12} />
                                    <span>{story.CreatedAt ? formatDistanceToNow(new Date(story.CreatedAt), { addSuffix: true }) : 'Recently'}</span>
                                </div>

                                <h3 className="mb-3 text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {story.Title}
                                </h3>

                                <p className="text-slate-500 line-clamp-3 leading-relaxed text-sm mb-6 flex-1">
                                    {story.Content}
                                </p>

                                <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-blue-600 group-hover:underline cursor-pointer">Continue Reading →</span>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
