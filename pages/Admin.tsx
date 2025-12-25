
import React, { useState, useRef, useEffect } from 'react';
import { WatchItem, Category, Status } from '../types';
import { CATEGORIES, STATUS_OPTIONS, GENRE_OPTIONS } from '../constants';

interface AdminProps {
    items: WatchItem[];
    onAdd: (entry: Omit<WatchItem, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
    onUpdate: (id: string, updatedData: Partial<WatchItem>) => void;
    onDelete: (id: string) => void;
    onImport: (data: WatchItem[]) => void;
    onClearAll: () => void;
}

export const Admin: React.FC<AdminProps> = ({ items, onAdd, onUpdate, onDelete, onImport, onClearAll }) => {
    const [editId, setEditId] = useState<string | null>(null);
    const [previewError, setPreviewError] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<'category' | 'status' | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<Omit<WatchItem, 'id' | 'dateAdded' | 'lastUpdated'>>({
        title: '',
        category: 'kdrama',
        poster: '',
        watchLink: '',
        trailerUrl: '',
        year: 2024,
        myRating: 8,
        episodes: 1,
        episodesWatched: 0,
        status: 'plan-to-watch',
        genres: [],
        favorite: false
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const resetForm = () => {
        setFormData({
            title: '', category: 'kdrama', poster: '', watchLink: '', trailerUrl: '',
            year: 2024, myRating: 8, episodes: 1, episodesWatched: 0, 
            status: 'plan-to-watch', genres: [], favorite: false
        });
        setEditId(null);
        setPreviewError(false);
        setSaveSuccess(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.poster || !formData.watchLink) {
            alert("Please fill in all required fields.");
            return;
        }

        if (editId) {
            onUpdate(editId, formData);
        } else {
            onAdd(formData);
        }

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleEdit = (item: WatchItem) => {
        setEditId(item.id);
        setFormData({
            title: item.title, category: item.category, poster: item.poster, 
            watchLink: item.watchLink, trailerUrl: item.trailerUrl || '', 
            year: item.year, myRating: item.myRating, 
            episodes: item.episodes, episodesWatched: item.episodesWatched, 
            status: item.status, genres: item.genres, favorite: item.favorite
        });
        setPreviewError(false);
        setSaveSuccess(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenreToggle = (genre: string) => {
        setFormData(prev => ({
            ...prev,
            genres: prev.genres.includes(genre) 
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre]
        }));
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `watchlist_v2025_backup.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                onImport(data);
                alert('Database Restore Complete!');
            } catch (err) {
                alert('Critical: Invalid database file format.');
            }
        };
        reader.readAsText(file);
    };

    const currentCategory = CATEGORIES.find(c => c.id === formData.category);
    const currentStatus = STATUS_OPTIONS.find(s => s.value === formData.status);

    return (
        <div className="space-y-12 pb-32">
            <div className="relative text-center pt-28 pb-4 px-4 overflow-hidden min-h-[25vh] flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-center z-20 relative">
                    <div className="inline-block px-5 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest text-white/50 mb-8 backdrop-blur-md bg-black/20">Registry Access Level 01</div>
                    <h1 className="font-title text-5xl md:text-8xl font-black text-gradient-purple uppercase tracking-tighter mb-6 leading-none drop-shadow-2xl">
                        Admin Panel
                    </h1>
                    <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5">Cinematic Database Terminal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full px-4">
                <div className="glass-premium p-10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="text-xs font-bold uppercase text-white/40 tracking-widest mb-4">Total Library Size</div>
                    <div className="text-6xl font-black font-title text-white">{items.length}</div>
                </div>
                <div className="glass-premium p-10 rounded-[2.5rem] flex flex-col justify-center gap-4 border-white/5">
                    <button onClick={handleExport} className="w-full py-4 bg-white/5 hover:bg-primary-light hover:text-white rounded-2xl text-xs font-bold uppercase tracking-widest border border-white/10 transition-all active:scale-95">Backup Library</button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest border border-white/10 transition-all active:scale-95">Restore Archive</button>
                    <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
                </div>
                <div className="glass-premium p-10 rounded-[2.5rem] flex items-center justify-center border-white/5">
                    <button onClick={() => { if(confirm('Permanently purge entire collection?')) onClearAll() }} className="w-full py-8 text-[#C20000] hover:bg-[#C20000]/10 rounded-[2rem] text-xs font-bold uppercase tracking-widest border border-[#C20000]/20 transition-all active:scale-95">Clear Entire Library</button>
                </div>
            </div>

            {/* Entry Form Section */}
            <section className="glass-refractive rounded-[3rem] overflow-hidden border-white/10 max-w-6xl mx-auto shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                <div className="p-6 md:p-20">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-3 h-3 rounded-full bg-primary-light animate-pulse"></div>
                            <h2 className="font-title text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                {editId ? `Updating: ${formData.title}` : 'Add New Content'}
                            </h2>
                        </div>
                        {editId && (
                            <button onClick={resetForm} className="px-6 py-3 glass bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-primary-light hover:bg-primary-light hover:text-white transition-all">
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                            <div className="space-y-10">
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">title *</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full glass-input rounded-2xl py-6 px-8 text-white text-lg font-bold focus:border-primary-light/40" placeholder="Title..." />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10" ref={dropdownRef}>
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">category *</label>
                                        <button 
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                                            className="w-full glass-input rounded-2xl py-6 px-8 flex items-center justify-between text-white text-sm font-bold hover:bg-white/5"
                                        >
                                            <span className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCategory?.color }}></div>
                                                {currentCategory?.name}
                                            </span>
                                            <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        
                                        {activeDropdown === 'category' && (
                                            <div className="absolute top-full left-0 right-0 mt-4 glass-premium rounded-2xl overflow-hidden z-[100] animate-scale-up border border-white/20 shadow-2xl">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => { setFormData({...formData, category: cat.id}); setActiveDropdown(null); }}
                                                        className={`w-full px-8 py-5 text-left text-xs font-bold uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-white/10 ${formData.category === cat.id ? 'bg-white/10 text-primary-light' : 'text-white/40'}`}
                                                    >
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">release year</label>
                                        <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full glass-input rounded-2xl py-6 px-8 text-white font-mono text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">poster url *</label>
                                    <input required type="text" value={formData.poster} onChange={e => { setFormData({...formData, poster: e.target.value}); setPreviewError(false); }} className="w-full glass-input rounded-2xl py-6 px-8 text-white text-xs font-mono" placeholder="https://..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">watch link *</label>
                                    <input required type="text" value={formData.watchLink} onChange={e => setFormData({...formData, watchLink: e.target.value})} className="w-full glass-input rounded-2xl py-6 px-8 text-white text-xs font-mono" placeholder="https://..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">trailer url (youtube)</label>
                                    <input type="text" value={formData.trailerUrl || ''} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} className="w-full glass-input rounded-2xl py-6 px-8 text-white text-xs font-mono" placeholder="https://www.youtube.com/watch?v=..." />
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">rating</label>
                                        <div className="flex items-center gap-5 glass-input rounded-2xl px-8">
                                            <span className="text-[#EDB600] font-black text-xl">★</span>
                                            <input type="number" min="1" max="10" value={formData.myRating} onChange={e => setFormData({...formData, myRating: parseInt(e.target.value)})} className="w-full bg-transparent py-6 text-white font-black text-2xl focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">status *</label>
                                        <button 
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
                                            className="w-full glass-input rounded-2xl py-6 px-8 flex items-center justify-between text-white text-sm font-bold hover:bg-white/5"
                                        >
                                            <span className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentStatus?.color }}></div>
                                                {currentStatus?.label}
                                            </span>
                                            <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'status' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        
                                        {activeDropdown === 'status' && (
                                            <div className="absolute top-full left-0 right-0 mt-4 glass-premium rounded-2xl overflow-hidden z-[100] animate-scale-up border border-white/20 shadow-2xl">
                                                {STATUS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => { setFormData({...formData, status: opt.value as Status}); setActiveDropdown(null); }}
                                                        className={`w-full px-8 py-5 text-left text-xs font-bold uppercase tracking-widest flex items-center gap-4 transition-all hover:bg-white/10 ${formData.status === opt.value ? 'bg-white/10 text-primary-light' : 'text-white/40'}`}
                                                    >
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }}></div>
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Genre Tags</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                                        {GENRE_OPTIONS.map(genre => {
                                            const isSelected = formData.genres.includes(genre);
                                            return (
                                                <button 
                                                    key={genre}
                                                    type="button"
                                                    onClick={() => handleGenreToggle(genre)}
                                                    className={`px-4 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center text-center ${isSelected ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(112,25,179,0.3)]' : 'bg-white/5 border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'}`}
                                                >
                                                    {genre}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Preview Component */}
                        <div className="flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 glass bg-primary/5 rounded-[3.5rem] border border-primary/20 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] pointer-events-none"></div>
                            
                            <div className="relative w-52 h-72 shrink-0 rounded-[2.5rem] overflow-hidden glass-premium bg-black/60 flex items-center justify-center text-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-[1.03] group-hover:border-primary/30">
                                {formData.poster && !previewError ? (
                                    <img src={formData.poster} className="w-full h-full object-cover transition-opacity duration-1000" alt="Preview" onError={() => setPreviewError(true)} />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 opacity-10">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[8px] font-black uppercase tracking-widest">No Asset</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            </div>

                            <div className="flex-1 text-center lg:text-left z-10 space-y-6">
                                <div>
                                    <div className="text-sm font-bold text-primary-light uppercase tracking-widest mb-4 flex items-center gap-3 justify-center lg:justify-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-ping"></div>
                                        Preview
                                    </div>
                                    <h4 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white break-words max-w-lg">
                                        {formData.title || <span className="text-white/10 italic">Title...</span>}
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    <span className="text-xs font-bold px-5 py-2 glass bg-white/5 rounded-full uppercase text-white/40 tracking-widest border border-white/5">{currentCategory?.name || "Uncategorized"}</span>
                                    <span className="text-xs font-bold px-5 py-2 glass bg-white/5 rounded-full uppercase text-white/40 tracking-widest border border-white/5">{formData.year || "2025"}</span>
                                    <span className="text-xs font-bold px-5 py-2 glass bg-white/5 rounded-full uppercase text-[#EDB600]/60 tracking-widest border border-[#EDB600]/10">★ {formData.myRating}.0</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full lg:w-72 z-10">
                                <button type="submit" className={`w-full py-6 ${saveSuccess ? 'bg-green-500 text-white shadow-[0_0_50px_rgba(34,197,94,0.4)]' : 'bg-white hover:bg-zinc-100 text-black'} font-bold rounded-3xl shadow-2xl transition-all uppercase tracking-normal text-sm active:scale-95 flex items-center justify-center gap-3`}>
                                    {saveSuccess ? 'Saved' : (editId ? 'Update' : 'Add to Collection')}
                                </button>
                                <button type="button" onClick={resetForm} className="w-full py-5 glass hover:bg-white/10 text-white/40 hover:text-white font-bold rounded-3xl transition-all uppercase tracking-normal text-sm border border-white/5">
                                    Reset Workspace
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* List Section */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">Managed Collection</h3>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="glass-premium rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white/[0.05] border-b border-white/5">
                                    <th className="pl-10 py-6 text-xs font-bold uppercase tracking-widest text-white/30">Poster</th>
                                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/30">Title</th>
                                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/30 text-center">Category</th>
                                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-white/30 text-center">Status</th>
                                    <th className="pr-10 py-6 text-xs font-bold uppercase tracking-widest text-white/30 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {items.map(item => {
                                    const cat = CATEGORIES.find(c => c.id === item.category);
                                    const statusObj = STATUS_OPTIONS.find(s => s.value === item.status);
                                    
                                    return (
                                        <tr key={item.id} className="group hover:bg-white/[0.02] transition-all duration-300 relative">
                                            <td className="pl-10 py-5">
                                                <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                                    <img src={item.poster} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-1">
                                                    <div className="text-base font-black text-white uppercase tracking-tight leading-none group-hover:text-primary-light transition-colors">{item.title}</div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                        <span>{item.year}</span>
                                                        <span className="text-[#EDB600]/40">★ {item.myRating}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{cat?.name}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div 
                                                    className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-white/5"
                                                    style={{ color: statusObj?.color, backgroundColor: `${statusObj?.color}10` }}
                                                >
                                                    {statusObj?.label}
                                                </div>
                                            </td>
                                            <td className="pr-10 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleEdit(item)} 
                                                        className="w-10 h-10 flex items-center justify-center glass bg-white/5 hover:bg-white text-white/20 hover:text-black rounded-xl transition-all border border-white/5"
                                                        title="Modify Entry"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => { if(confirm('Purge this entry from library?')) onDelete(item.id) }} 
                                                        className="w-10 h-10 flex items-center justify-center glass bg-white/5 hover:bg-[#C20000] text-white/20 hover:text-white rounded-xl transition-all border border-white/5"
                                                        title="Purge Entry"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};
