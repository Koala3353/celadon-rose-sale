import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.7 3.7-.4.5-.7 1.1-.7 1.8 0 1.5 1.3 2.8 2.8 2.8.3 0 .5 0 .7-.1v5.3c0 1 .8 2 2 2s2-1 2-2v-5.3c.2.1.5.1.7.1 1.5 0 2.8-1.3 2.8-2.8 0-.7-.3-1.3-.7-1.8 1-1 1.7-2.2 1.7-3.7C16.5 4 14.5 2 12 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Rose Sale 2026
            </span>
          </motion.div>
          <p className="text-gray-400 leading-relaxed max-w-md mx-auto">
            Spreading love one rose at a time. Beautiful roses for every occasion, delivered with care.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.a
            href="https://www.facebook.com/CeladonRoseSale/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-800 hover:bg-rose-600 rounded-full flex items-center justify-center transition-colors"
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
        <div className="pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2026 Rose Sale. Made with 💕 by Keene.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
