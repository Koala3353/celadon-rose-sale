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
            <div className="w-12 h-12">
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
        <div className="pt-6 border-t border-rose-100 text-center text-gray-400 text-sm relative">
          <p>© 2026 Rose Sale. Made with 💕 by Keene.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
