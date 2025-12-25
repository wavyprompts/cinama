
import React from 'react';
import { WatchItem } from '../types';
import { STATUS_OPTIONS } from '../constants';

interface DetailModalProps {
    item: WatchItem | null;
    onClose: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onEdit, onDelete }) => {
    if (!item) return null;

    const statusInfo = STATUS_OPTIONS.find(s => s.value === item.status);
    const trailerId = getYoutubeId(item.trailerUrl);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4">
            {/* Ultra-dark backdrop with heavy blur */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={onClose} />
            
            <div className="relative glass-premium w-full max-w-6xl max-h-[96vh] overflow-y-auto rounded-[3.5rem] border border-white/20 shadow-[0_0_150px_rgba(0,0,0,1)] animate-scale-up custom-scrollbar overflow-x-hidden">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-20 group"
                >
                    <svg className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col min-h-full">
                    <div className="flex flex-col lg:flex-row">
                        {/* Poster Section with Floating Effect */}
                        <div className="w-full lg:w-[40%] p-8 lg:p-12 shrink-0 flex items-center">
                            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 aspect-[2/3] w-full transform transition-transform duration-700 hover:scale-[1.02]">
                                <img 
                                    src={item.poster} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-60" />
                            </div>
                        </div>

                        {/* Content Section with Refined Typography */}
                        <div className="flex-1 p-8 lg:p-16 lg:pl-4 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-6">
                                <span 
                                    className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg"
                                    style={{ 
                                        backgroundColor: `${statusInfo?.color}15`, 
                                        borderColor: `${statusInfo?.color}40`,
                                        color: statusInfo?.color 
                                    }}
                                >
                                    {statusInfo?.label}
                                </span>
                            </div>

                            <h2 className="font-title text-[2rem] md:text-[3rem] lg:text-[4rem] font-black mb-8 leading-[0.9] tracking-tighter uppercase text-white">
                                {item.title}
                            </h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-1">
                                    <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Release Year</div>
                                    <div className="text-2xl font-black tracking-tight text-white/90">{item.year}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Personal Score</div>
                                    <div className="text-2xl font-black tracking-tight text-[#EDB600]">★ {item.myRating}<span className="text-xs text-white/10 ml-1"> / 10</span></div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-5">Genre</div>
                                <div className="flex flex-wrap gap-2.5">
                                    {item.genres.map(g => (
                                        <span key={g} className="px-4 py-2.5 glass bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-default">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center gap-5 mt-4">
                                <a 
                                    href={item.watchLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-4 py-5 bg-white hover:bg-zinc-100 text-black rounded-[1.75rem] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:translate-y-0"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    <span className="font-title font-medium text-xs md:text-sm uppercase tracking-[0.2em]">WATCH NOW</span>
                                </a>
                                <button 
                                    onClick={() => onEdit(item.id)}
                                    className="w-16 h-16 shrink-0 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white border border-white/10 rounded-2xl transition-all hover:-translate-y-1 shadow-xl"
                                    title="Edit Record"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trailer Section */}
                    {trailerId && (
                        <div className="p-8 lg:p-16 lg:pt-0">
                            <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-6 pl-2">Official Trailer</div>
                            <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative bg-black">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${trailerId}?rel=0`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Official Trailer"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
