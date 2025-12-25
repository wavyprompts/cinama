
import React from 'react';
import { WatchItem } from '../types';
import { STATUS_OPTIONS } from '../constants';

interface WatchCardProps {
    item: WatchItem;
    onInfo: (id: string) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({ item, onInfo }) => {
    const statusInfo = STATUS_OPTIONS.find(s => s.value === item.status);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div 
            onClick={() => onInfo(item.id)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative poster-card card-3d rounded-2xl overflow-hidden aspect-[2/3] cursor-pointer bg-black"
        >
            {/* Poster Image */}
            <img 
                src={item.poster} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />
            
            {/* Hover Overlay: Only visible on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            {/* Small Play Button (Centered on hover) */}
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <span className="text-xl ml-1">▶</span>
                </div>
            </div>

            {/* Status Badge (Top Right - only on hover) */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md bg-black/60 border border-white/10 text-white">
                    {statusInfo?.label}
                </div>
            </div>

            {/* Title & Info (Bottom - only on hover) */}
            <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
                <h3 className="text-white text-sm font-bold truncate drop-shadow-lg tracking-tight">
                    {item.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-medium text-white/60">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span className="text-[#EDB600]">★ {item.myRating}</span>
                </div>
            </div>
        </div>
    );
};
