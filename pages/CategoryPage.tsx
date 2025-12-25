
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WatchItem, Category, Status } from '../types';
import { CATEGORIES, STATUS_OPTIONS } from '../constants';
import { WatchCard } from '../components/WatchCard';
import { ParallaxPosterWall } from '../components/ParallaxPosterWall';

interface CategoryPageProps {
    categoryIds: Category[];
    title: string;
    items: WatchItem[];
    onInfo: (id: string) => void;
}

type SortOption = 'date' | 'rating' | 'year' | 'title';

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryIds, title, items, onInfo }) => {
    const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const categoryInfo = CATEGORIES.find(c => categoryIds.includes(c.id));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAndSorted = useMemo(() => {
        let result = items.filter(item => categoryIds.includes(item.category));
        
        if (statusFilter !== 'all') {
            result = result.filter(item => item.status === statusFilter);
        }

        result.sort((a, b) => {
            if (sortBy === 'date') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            if (sortBy === 'rating') return b.myRating - a.myRating;
            if (sortBy === 'year') return b.year - a.year;
            return a.title.localeCompare(b.title);
        });

        return result;
    }, [items, categoryIds, statusFilter, sortBy]);

    const sortLabels: Record<SortOption, string> = {
        date: 'Sort: Newest',
        rating: 'Sort: Rating',
        year: 'Sort: Year',
        title: 'Sort: A-Z'
    };

    return (
        <div className="space-y-16 pb-32">
            {/* Massive Header Section - Increased height to 70vh for uniformity */}
            <div className="relative pt-32 pb-10 text-center overflow-hidden min-h-[70vh] flex flex-col items-center justify-center">
                <ParallaxPosterWall posters={items.map(i => i.poster)} />
                
                <div className="w-full flex flex-col items-center z-20 relative">
                    <div className="inline-block px-5 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest text-white/50 mb-8 backdrop-blur-md bg-black/20">
                        Database 01
                    </div>
                    <h1 className="font-title text-4xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl">
                        <span style={{ color: categoryInfo?.color }} className="opacity-100 saturate-[1.15]">
                            {title}
                        </span>
                    </h1>
                    
                    <div className="flex flex-wrap items-center justify-center gap-12 glass p-6 rounded-3xl bg-black/40 backdrop-blur-md border-white/5 shadow-2xl">
                        <div className="text-center">
                            <div className="text-2xl font-black">{filteredAndSorted.length}</div>
                            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Registry Count</div>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="text-center">
                            <div className="text-2xl font-black">{filteredAndSorted.filter(i => i.status === 'completed').length}</div>
                            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Archived</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pill Shape Island Navigation */}
            <div className="sticky top-24 z-40 flex justify-center pb-8 pointer-events-none">
                <div className="pointer-events-auto glass-premium px-2 py-2 rounded-full flex items-center gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 scale-90 md:scale-100 transition-transform">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setStatusFilter('all')}
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-500 ${statusFilter === 'all' ? 'bg-white text-black shadow-lg scale-110' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                            title="All"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        {STATUS_OPTIONS.map(status => (
                            <button 
                                key={status.value}
                                onClick={() => setStatusFilter(status.value as Status)}
                                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-500 ${statusFilter === status.value ? 'bg-white text-black shadow-lg scale-110' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                title={status.label}
                            >
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: statusFilter === status.value ? 'currentColor' : status.color }}></div>
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <div className="relative" ref={sortRef}>
                        <button 
                            onClick={() => setSortOpen(!sortOpen)}
                            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <span className="hidden md:inline">{sortLabels[sortBy]}</span>
                            <span className="md:hidden">Sort</span>
                            <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        {sortOpen && (
                            <div className="absolute top-full mt-4 right-0 glass-premium w-60 rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.8)] animate-scale-up z-[110]">
                                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSortBy(option);
                                            setSortOpen(false);
                                        }}
                                        className={`w-full px-8 py-5 text-left text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10 ${sortBy === option ? 'text-primary-light bg-white/5' : 'text-white/40'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            {sortLabels[option]}
                                            {sortBy === option && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-light shadow-[0_0_10px_rgba(164,46,255,1)]"></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {filteredAndSorted.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 px-2">
                    {filteredAndSorted.map(item => (
                        <WatchCard key={item.id} item={item} onInfo={onInfo} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 glass rounded-[3rem] border-white/5 border-dashed">
                    <div className="text-5xl mb-6 opacity-40">🌫️</div>
                    <div className="text-xs font-bold text-white/20 uppercase tracking-widest">Empty Registry</div>
                </div>
            )}
        </div>
    );
};
