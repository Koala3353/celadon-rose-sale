import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { parseBundleString, formatOptionName, BundleSlot } from '../utils/bundleHelpers';

interface BundleSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const BundleSelectionModal: React.FC<BundleSelectionModalProps> = ({ isOpen, onClose, product }) => {
    const { addToCart, setIsCartOpen } = useCart();
    const [bundleSlots, setBundleSlots] = useState<BundleSlot[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});

    // Reset/Initialize when product changes or modal opens
    useEffect(() => {
        if (product && product.bundleItems && isOpen) {
            try {
                const parsed = parseBundleString(product.bundleItems);
                setBundleSlots(parsed);

                const initialSelections: { [key: number]: string } = {};
                parsed.forEach((slot, index) => {
                    if (slot.isFixed) {
                        initialSelections[index] = slot.options[0];
                    }
                });
                setSelectedOptions(initialSelections);
            } catch (error) {
                console.error("Failed to parse bundle", error);
                setBundleSlots([]);
            }
        } else {
            setBundleSlots([]);
            setSelectedOptions({});
        }
    }, [product, isOpen]);

    if (!isOpen || !product) return null;

    const isBundleReady = bundleSlots.every((slot, index) => selectedOptions[index]);

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            ...product,
            selectedOptions
        });

        onClose();
        setIsCartOpen(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-rose-100 sticky top-0 bg-white z-20 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-playfair font-bold text-gray-800">Customize Bundle</h3>
                                <p className="text-rose-600 font-medium">{product.name}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Product Image Preview (Tiny) */}
                            <div className="flex items-center gap-4 bg-rose-50 p-3 rounded-xl">
                                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                                <div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                </div>
                            </div>

                            {/* Slots */}
                            <div className="space-y-6">
                                {bundleSlots.map((slot, index) => (
                                    <div key={index} className="pb-4 border-b border-rose-100 last:border-0 last:pb-0">
                                        <p className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">
                                            Item {index + 1}: <span className="text-rose-600">{slot.isFixed ? formatOptionName(slot.options[0]) : 'Choose One'}</span>
                                        </p>

                                        {!slot.isFixed ? (
                                            <div className="flex flex-wrap gap-2">
                                                {slot.options.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [index]: option }))}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedOptions[index] === option
                                                            ? 'bg-rose-500 text-white border-rose-500 shadow-md ring-2 ring-rose-200'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50'
                                                            }`}
                                                    >
                                                        {formatOptionName(option)}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 inline-block">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {formatOptionName(slot.options[0])}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-rose-100 bg-gray-50 sticky bottom-0 z-20">
                            <button
                                onClick={handleAddToCart}
                                disabled={!isBundleReady}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${!isBundleReady
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-rose-200 hover:scale-[1.02]'
                                    }`}
                            >
                                {isBundleReady ? 'Add to Bundle' : 'Select All Options'}
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BundleSelectionModal;
