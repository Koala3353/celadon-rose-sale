import React from 'react';
import { motion } from 'framer-motion';

const RunningAnimation: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 overflow-hidden pointer-events-none h-12 md:h-16 z-30">
            <motion.div
                className="flex items-end gap-8 md:gap-16 absolute bottom-0"
                initial={{ x: '-20%' }}
                animate={{ x: '110vw' }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0
                }}
            >
                {/* Guy Running with Flowers (Chaser - Left/Behind) */}
                <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                    className="w-10 h-10 md:w-14 md:h-14 text-gray-500 transform scale-x-100"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="3" fill="currentColor" fillOpacity="0.2" />
                        {/* Body */}
                        <path d="M12 8 L12 15" />
                        {/* Legs */}
                        <path d="M12 15 L9 22" /> {/* Back leg */}
                        <path d="M12 15 L16 20 L18 19" /> {/* Front leg bent */}
                        {/* Arms */}
                        <path d="M12 10 L9 13" /> {/* Back arm */}
                        <path d="M12 10 L16 12" /> {/* Front arm holding flowers */}
                        {/* Flowers */}
                        <g transform="translate(16, 10)">
                            <circle cx="0" cy="-1" r="1.5" className="text-rose-500" fill="currentColor" stroke="none" />
                            <circle cx="-1.5" cy="0.5" r="1.5" className="text-pink-500" fill="currentColor" stroke="none" />
                            <circle cx="1.5" cy="0.5" r="1.5" className="text-red-500" fill="currentColor" stroke="none" />
                        </g>
                    </svg>
                </motion.div>

                {/* Girl Running (Leader - Right/Ahead) */}
                <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    className="w-10 h-10 md:w-14 md:h-14 text-rose-400 transform scale-x-100"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="3" fill="currentColor" fillOpacity="0.2" />
                        {/* Arms */}
                        <path d="M12 9 L9 12" />
                        <path d="M12 9 L15 12" />
                        {/* Flowy Dress */}
                        <path d="M12 8 L9 16 Q 12 18 15 16 Z" fill="currentColor" fillOpacity="0.1" />
                        {/* Legs */}
                        <path d="M11 16 L9 22" />
                        <path d="M13 16 L16 20 L18 19" />
                        {/* Pony Tail */}
                        <path d="M15 5 Q 18 6 16 10" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RunningAnimation;
