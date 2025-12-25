
import React, { useMemo } from 'react';

interface ParallaxPosterWallProps {
    posters: string[];
}

export const ParallaxPosterWall: React.FC<ParallaxPosterWallProps> = ({ posters }) => {
    // Generate columns
    const columns = useMemo(() => {
        if (!posters.length) return [];
        
        // Ensure we have enough posters to fill space
        let pool = [...posters];
        while (pool.length < 100) {
            pool = [...pool, ...posters];
        }
        // Shuffle for randomness
        pool = pool.sort(() => Math.random() - 0.5);

        const cols = [[], [], [], [], [], [], []]; // 7 columns for density
        pool.forEach((p: string, i: number) => {
            cols[i % 7].push(p);
        });
        return cols;
    }, [posters]);

    if (!posters.length) return null;

    return (
        <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ 
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
            }}
        >
            {/* Darken overlay for better text readability on top - Reduced opacity */}
            <div className="absolute inset-0 bg-[#050505]/5 z-10" />
            
            {/* The Wall - Large scale/radius retained, but poster size reverted to smaller dimensions */}
            <div className="flex gap-4 md:gap-6 justify-center items-start w-[200%] -ml-[50%] -mt-[50%] h-[200%] rotate-12 scale-125">
                {columns.map((colPosters: any[], i: number) => (
                    <div 
                        key={i} 
                        className={`flex flex-col gap-4 md:gap-6 w-32 md:w-48 shrink-0 will-change-transform ${
                            i % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'
                        }`}
                        style={{ 
                            // Significantly increased duration for even slower speed
                            animationDuration: `${180 + (i * 15)}s`, 
                        }}
                    >
                        {/* Quadrupled content (4 lines/sets) for seamless loop and density */}
                        {[...colPosters, ...colPosters, ...colPosters, ...colPosters].map((src: string, idx: number) => (
                            <div key={idx} className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-white/5 opacity-40">
                                <img 
                                    src={src} 
                                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-500" 
                                    alt="" 
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
