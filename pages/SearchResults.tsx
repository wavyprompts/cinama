
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { WatchItem } from '../types';
import { WatchCard } from '../components/WatchCard';
import { ParallaxPosterWall } from '../components/ParallaxPosterWall';

interface SearchResultsProps {
    items: WatchItem[];
    onInfo: (id: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ items, onInfo }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQ = query.toLowerCase();
        return items.filter(item => 
            item.title.toLowerCase().includes(lowerQ) || 
            item.category.toLowerCase().includes(lowerQ)
        );
    }, [items, query]);

    return (
        <div className="space-y-16 pb-32">
            <div className="relative pt-32 pb-10 text-center overflow-hidden min-h-[40vh] flex flex-col items-center justify-center">
                <ParallaxPosterWall posters={items.map(i => i.poster)} />
                <div className="w-full flex flex-col items-center z-20 relative">
                     <div className="inline-block px-5 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest text-white/50 mb-8 backdrop-blur-md bg-black/20">
                        Search Protocol
                    </div>
                    <h1 className="font-title text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-white drop-shadow-2xl">
                        Results for <span className="text-gradient-purple">"{query}"</span>
                    </h1>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">{results.length} Records Found</div>
                </div>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 px-2">
                    {results.map(item => (
                        <WatchCard key={item.id} item={item} onInfo={onInfo} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-50">
                    <div className="text-6xl mb-4">📡</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-white/40">Signal Lost / No Matches Found</div>
                </div>
            )}
        </div>
    );
};
