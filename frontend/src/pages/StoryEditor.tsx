import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Save, ArrowLeft, Loader2, Sparkles, Globe, Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const StoryEditor: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [formattedContent, setFormattedContent] = useState(''); // Placeholder for future rich text

    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [fixing, setFixing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Please add a title and some content');
            return;
        }

        setSaving(true);
        try {
            await api.post('/stories', { title, content, isPublic });
            toast.success('Story published successfully!');
            navigate('/');
        } catch (error) {
            console.error('Failed to create story', error);
            toast.error('Failed to publish story');
        } finally {
            setSaving(false);
        }
    };

    const handleAIGenerate = async (mode: 'continue' | 'fix' = 'continue') => {
        if (!content.trim()) {
            toast.error('Write a few words first so the AI has context!');
            return;
        }

        if (mode === 'continue') setGenerating(true);
        else setFixing(true);

        const loadingMsg = mode === 'continue' ? 'Consulting the creative muse...' : 'Polishing your grammar...';
        const loadingId = toast.loading(loadingMsg);

        try {
            const response = await api.post('/stories/generate', { context: content, mode });
            const newText = response.data.suggestion;

            if (mode === 'fix') {
                setContent(newText); // Replace content
                toast.success('Grammar fixed!', { id: loadingId });
            } else {
                setContent(prev => prev + (prev.endsWith(' ') ? '' : ' ') + newText); // Append content
                toast.success('Magic applied!', { id: loadingId });
            }
        } catch (error) {
            console.error('AI Generation failed', error);
            toast.error('AI unavailable', { id: loadingId });
        } finally {
            setGenerating(false);
            setFixing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900">
            {/* Top Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100 group"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <span className="text-sm font-medium text-slate-400">
                        Draft <span className="mx-2">•</span> {saving ? 'Saving...' : 'Unsaved changes'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Privacy Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all border ${isPublic
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                    >
                        {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                        {isPublic ? 'Public Story' : 'Private Draft'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 active:scale-95 transition-all shadow-sm hover:shadow"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Publish
                    </button>
                </div>
            </motion.nav>

            {/* Editor Container */}
            <main className="container max-w-3xl mx-auto px-6 pt-32 pb-20">
                <div className="space-y-8">
                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full text-5xl font-extrabold text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent leading-tight resize-none"
                        autoFocus
                    />

                    {/* Magic Toolbar */}
                    <AnimatePresence>
                        {content.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="sticky top-24 z-40 mb-8"
                            >
                                <div className="absolute left-[-60px] top-2 hidden xl:flex flex-col gap-2">
                                    <button
                                        onClick={() => handleAIGenerate('continue')}
                                        disabled={generating || fixing}
                                        className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                                        title="Continue Story (AI)"
                                    >
                                        {generating ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleAIGenerate('fix')}
                                        disabled={generating || fixing}
                                        className="p-3 bg-white text-emerald-600 border border-slate-200 rounded-full shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                                        title="Fix Grammar & Spelling"
                                    >
                                        {fixing ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Check size={20} />
                                        )}
                                    </button>
                                </div>
                                {/* Mobile/Tablet Toolbar inline */}
                                <div className="xl:hidden flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">AI Tools</span>
                                    <button
                                        onClick={handleAIGenerate}
                                        disabled={generating}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:text-purple-600 hover:border-purple-200 transition-colors shadow-sm"
                                    >
                                        <Wand2 size={14} />
                                        {generating ? 'Thinking...' : 'Continue Story'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content Area */}
                    <div className="relative min-h-[60vh] text-xl leading-8 text-slate-700 font-serif">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tell your story..."
                            className="w-full h-full min-h-[60vh] resize-none border-none outline-none bg-transparent placeholder:font-sans placeholder:text-slate-300"
                        />

                        {/* Floating Action Button for Empty State */}
                        {content.length === 0 && (
                            <div className="absolute top-2 left-0 right-0 text-center pointer-events-none opacity-0 md:opacity-100 delay-500 transition-opacity">
                                <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                                    <Sparkles size={14} /> Start writing to unlock AI tools
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StoryEditor;
