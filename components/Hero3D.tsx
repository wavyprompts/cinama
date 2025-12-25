
import React, { useRef } from 'react';

interface Hero3DProps {
    children: React.ReactNode;
    className?: string;
    maxMove?: number;
}

export const Hero3D: React.FC<Hero3DProps> = ({ children, className = '', maxMove = 15 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !contentRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate gentle pan based on cursor position
        const moveX = ((x - centerX) / centerX) * maxMove;
        const moveY = ((y - centerY) / centerY) * maxMove;

        // Apply translation instead of rotation for a subtle parallax feel
        contentRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    };

    const handleMouseLeave = () => {
        if (contentRef.current) {
            contentRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center justify-center ${className}`}
            style={{ perspective: '1200px' }}
        >
            <div 
                ref={contentRef}
                className="transition-transform duration-700 ease-out preserve-3d"
            >
                {/* Continuous floating animation wrapper */}
                <div className="animate-float preserve-3d">
                    {children}
                </div>
            </div>
        </div>
    );
};
