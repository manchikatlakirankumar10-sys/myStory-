import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { User, Globe, MessageCircle, Heart, Share2 } from 'lucide-react';

interface Story {
    ID: number;
    Title: string;
    Content: string;
    User: {
        Email: string;
    }
}

const PublicFeed: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await api.get('/stories');
            setStories(response.data.stories || []);
        } catch (error) {
            console.error('Failed to fetch public stories', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                <div className="w-16 h-3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                            <div className="w-full h-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-3">
                    <Globe className="text-blue-500" />
                    Public Feed
                </h1>
                <p className="mt-2 text-slate-500">Discover stories from around the world.</p>
            </div>

            {stories.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No public stories yet. Be the first to share one!</p>
                </div>
            ) : (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.ID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {story.User?.Email ? (
                                            <>
                                                {story.User.Email.substring(0, 2)}***@{story.User.Email.split('@')[1]}
                                            </>
                                        ) : 'Anonymous'}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <span>Published publicly</span>
                                        <span>•</span>
                                        <span>Just now</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{story.Title}</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]">{story.Content}</p>

                            {/* Fake Engagement Actions for "Facebook" feel */}
                            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
                                <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium">
                                    <Heart size={18} /> Like
                                </button>
                                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
                                    <MessageCircle size={18} /> Comment
                                </button>
                                <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium ml-auto">
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default PublicFeed;
