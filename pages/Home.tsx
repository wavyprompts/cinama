
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { WatchItem } from '../types';
import { CATEGORIES } from '../constants';
import { WatchCard } from '../components/WatchCard';
import { ParallaxPosterWall } from '../components/ParallaxPosterWall';

interface HomeProps {
    items: WatchItem[];
    onInfo: (id: string) => void;
}

const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group/carousel">
            {/* Navigation Controls */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-4 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 shadow-2xl"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:-translate-x-4 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 shadow-2xl"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Carousel Container */}
            <div 
                ref={scrollRef}
                className="flex gap-8 px-6 overflow-x-auto no-scrollbar pb-8 snap-x scroll-smooth scroll-px-6"
            >
                {children}
            </div>
            
            {/* Visual Depth Gradient */}
            <div className="absolute top-0 right-0 bottom-8 w-24 bg-gradient-to-l from-black/60 to-transparent pointer-events-none z-10"></div>
        </div>
    );
};

export const Home: React.FC<HomeProps> = ({ items, onInfo }) => {
    const stats = {
        total: items.length,
        watched: items.filter(i => i.status === 'completed').length,
        currently: items.filter(i => i.status === 'watching').length,
        favorites: items.filter(i => i.favorite).length
    };

    const recentlyAdded = items.slice(0, 10);
    
    // Sort items by lastUpdated for the "Jump Back In" section
    const recentActivity = items
        .filter(i => ['watching', 'completed'].includes(i.status))
        .sort((a, b) => {
            const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
            const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 12);

    const getCategoryItems = (catId: string) => {
        return items.filter(item => item.category === catId).slice(0, 12);
    };

    return (
        <div className="space-y-32 pb-20">
            {/* Massive Cinema Hero */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-32 overflow-hidden">
                <ParallaxPosterWall posters={items.map(i => i.poster)} />
                
                <div className="w-full flex justify-center z-20 relative">
                    <div className="text-center max-w-5xl px-4 space-y-12">
                        <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 glass rounded-full text-[10px] md:text-xs font-bold tracking-wider md:tracking-widest uppercase text-primary-light bg-black/30 backdrop-blur-md border-white/10">
                            Personal Cinema Database v2.0
                        </div>
                        
                        <h1 className="font-title text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] uppercase drop-shadow-2xl">
                            CINEMATIC <br/> <span className="text-gradient-purple">ODYSSEY.</span>
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 glass p-10 rounded-[3rem] border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <div className="space-y-1">
                                <div className="text-4xl md:text-6xl font-title font-black text-white">{stats.total}</div>
                                <div className="text-xs uppercase font-bold text-white/30 tracking-widest">Total Records</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl md:text-6xl font-title font-black text-white">{stats.watched}</div>
                                <div className="text-xs uppercase font-bold text-white/30 tracking-widest">Finished</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl md:text-6xl font-title font-black text-white">{stats.currently}</div>
                                <div className="text-xs uppercase font-bold text-white/30 tracking-widest">Watching</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl md:text-6xl font-title font-black text-white">{stats.favorites}</div>
                                <div className="text-xs uppercase font-bold text-white/30 tracking-widest">Favorites</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Activity / Jump Back In Section */}
            {recentActivity.length > 0 && (
                <section className="space-y-12 group/section">
                    <div className="flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 md:w-2 h-8 md:h-12 rounded-full bg-primary-light shadow-[0_0_15px_rgba(164,46,255,0.5)]"></div>
                            <div className="space-y-1">
                                <h2 className="font-title text-lg md:text-xl font-black uppercase tracking-tight leading-none">Jump Back In</h2>
                                <p className="text-xs font-bold text-white/30 uppercase tracking-widest leading-none">Recent Activity</p>
                            </div>
                        </div>
                    </div>
                    <Carousel>
                        {recentActivity.map(item => (
                            <div key={item.id} className="w-[160px] md:w-[224px] shrink-0 snap-start">
                                <WatchCard item={item} onInfo={onInfo} />
                            </div>
                        ))}
                        <div className="w-1 shrink-0"></div>
                    </Carousel>
                </section>
            )}

            {/* Recently Added Section */}
            <section className="space-y-12 group/section">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 md:w-2 h-8 md:h-10 rounded-full bg-primary-light shadow-[0_0_15px_rgba(164,46,255,0.5)]"></div>
                        <h2 className="font-title text-lg md:text-xl font-black uppercase tracking-tight leading-none">Recently Added</h2>
                    </div>
                    <Link to="/search" className="flex items-center gap-2 md:gap-4 px-5 py-2 md:px-8 md:py-3 glass bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all duration-500 shadow-2xl group-hover/section:scale-105 active:scale-95">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">More</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                
                <Carousel>
                    {recentlyAdded.map(item => (
                        <div key={item.id} className="w-[160px] md:w-[224px] shrink-0 snap-start">
                            <WatchCard item={item} onInfo={onInfo} />
                        </div>
                    ))}
                    <div className="w-1 shrink-0"></div>
                </Carousel>
            </section>

            {/* Dynamic Category Carousels */}
            <div className="space-y-40">
                {CATEGORIES.map(cat => {
                    const catItems = getCategoryItems(cat.id);
                    if (catItems.length === 0) return null;

                    return (
                        <section key={cat.id} className="space-y-10 group/section">
                            <div className="flex items-center justify-between px-6">
                                <div className="flex items-center gap-6">
                                    <div 
                                        className="w-2 h-10 rounded-full transition-shadow duration-300" 
                                        style={{ 
                                            backgroundColor: cat.color,
                                            boxShadow: `0 0 15px ${cat.color}80`
                                        }}
                                    ></div>
                                    <h2 className="font-title text-lg md:text-3xl font-black uppercase tracking-tighter text-white whitespace-nowrap">
                                        {cat.name}
                                    </h2>
                                </div>
                                
                                <Link 
                                    to={cat.path} 
                                    className="flex items-center gap-2 md:gap-4 px-5 py-2 md:px-8 md:py-3 glass bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all duration-500 shadow-2xl group-hover/section:scale-105 active:scale-95"
                                >
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">More</span>
                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            
                            <Carousel>
                                {catItems.map(item => (
                                    <div key={item.id} className="w-[160px] md:w-[224px] shrink-0 snap-start">
                                        <WatchCard item={item} onInfo={onInfo} />
                                    </div>
                                ))}
                                <Link 
                                    to={cat.path}
                                    className="w-[160px] md:w-[224px] shrink-0 glass bg-white/5 border-dashed border-white/20 rounded-[2rem] flex flex-col items-center justify-center gap-6 group/more transition-all hover:bg-white/10 hover:border-white/40 snap-start"
                                >
                                    <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center text-white/20 group-hover/more:text-white group-hover/more:border-white group-hover/more:scale-110 transition-all duration-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-white/40 group-hover/more:text-white uppercase tracking-widest transition-colors">See Complete</div>
                                        <div className="text-xs font-bold text-white/20 uppercase tracking-widest mt-1">Archive</div>
                                    </div>
                                </Link>
                            </Carousel>
                        </section>
                    );
                })}
            </div>
            
            {/* Sector Navigation Bento Grid */}
            <section className="space-y-12 px-6">
                <div className="text-center space-y-4">
                    <h2 className="font-title text-lg md:text-xl font-black uppercase tracking-tight">Sector Navigation</h2>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Jump to Industry Database</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Link to="/kdrama" className="relative group md:col-span-2 glass-refractive h-72 rounded-[3.5rem] overflow-hidden">
                        <div className="absolute inset-0 bg-kdrama/20 opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-12">
                            <span className="text-6xl mb-6">🏮</span>
                            <h3 className="font-title text-4xl font-black text-white uppercase tracking-tighter">South Korea</h3>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Dramas & Films Archive</p>
                        </div>
                    </Link>
                    <Link to="/anime" className="relative group glass-refractive h-72 rounded-[3.5rem] overflow-hidden">
                        <div className="absolute inset-0 bg-anime/20 opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <span className="text-6xl mb-6">🌸</span>
                            <h3 className="font-title text-2xl font-black text-white uppercase tracking-tighter">Anime</h3>
                        </div>
                    </Link>
                    <Link to="/hdrama" className="relative group glass-refractive h-72 rounded-[3.5rem] overflow-hidden">
                        <div className="absolute inset-0 bg-hollywood/20 opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <span className="text-6xl mb-6">🎬</span>
                            <h3 className="font-title text-2xl font-black text-white uppercase tracking-tighter">Hollywood</h3>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};
