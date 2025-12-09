import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-rose-50 border-t border-rose-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 overflow-hidden rounded-full shadow-lg border-2 border-rose-100">
              <img
                src={`${import.meta.env.BASE_URL}assets/logo.png`}
                alt="Rose Sale Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent font-playfair">
              Rose Sale 2026
            </span>
          </motion.div>
          <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
            Spreading love one rose at a time. Beautiful roses for every occasion, delivered with care.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.a
            href="https://www.facebook.com/CeladonRoseSale/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white border border-rose-100 hover:bg-rose-50 hover:border-rose-200 text-rose-500 rounded-full flex items-center justify-center transition-colors shadow-sm"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </motion.a>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-rose-100 text-center text-gray-400 text-sm">
          <p>© 2026 Rose Sale. Made with 💕 by Keene.</p>
        </div>

        {/* Running Animation */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none h-16">
          <motion.div
            className="flex items-end gap-12 absolute bottom-0"
            initial={{ x: '-20%' }}
            animate={{ x: '110vw' }}
            transition={{
              duration: 20, // Slower for vector art
              repeat: Infinity,
              ease: "linear",
              delay: 0
            }}
          >
            {/* Girl Running */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              className="w-12 h-12 text-rose-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" fill="currentColor" fillOpacity="0.2" />
                <path d="M10 8 L14 8 L16 18 L19 18" /> {/* Arms/front */}
                <path d="M12 8 L8 18" /> {/* Back arm */}
                {/* Dress */}
                <path d="M12 8 L9 16 L15 16 Z" fill="currentColor" fillOpacity="0.1" />
                {/* Legs */}
                <path d="M10 16 L8 22" />
                <path d="M14 16 L17 21" />
                {/* Hair */}
                <path d="M15 5 C15 5 17 6 17 8" />
              </svg>
            </motion.div>

            {/* Guy Running with Flowers */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
              className="w-12 h-12 text-gray-500"
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
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
