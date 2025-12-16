import { Product } from '../types';

export interface BundleSlot {
    options: string[]; // Options for this slot (e.g. from "a/b")
    label: string;     // Display label "Select Option" or the single item name
    isFixed: boolean;  // True if only 1 option
}

/**
 * Parses a bundle string like "red-rose/pink-rose, chocolate" into a structured array
 * Output: 
 * [
 *   { options: ["red-rose", "pink-rose"], label: "Select Option", isFixed: false },
 *   { options: ["chocolate"], label: "Chocolate", isFixed: true }
 * ]
 */
export const parseBundleString = (bundleStr?: string): BundleSlot[] => {
    if (!bundleStr) return [];

    return bundleStr.split(',').map(part => {
        const cleanPart = part.trim();
        const options = cleanPart.split('/').map(opt => opt.trim()).filter(Boolean);

        if (options.length === 0) return null;

        return {
            options,
            label: options.length === 1 ? options[0] : 'Select Option',
            isFixed: options.length === 1
        };
    }).filter(Boolean) as BundleSlot[];
};

/**
 * Helper to pretty print option names
 * e.g. "red-rose" -> "Red Rose"
 */
export const formatOptionName = (option: string): string => {
    return option
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Checks if a specific product (by ID or name) is part of a bundle
 */
export const getRelatedBundles = (product: Product, allProducts: Product[]): Product[] => {
    if (!product.id && !product.name) return [];

    const productId = product.id.toLowerCase();
    // Simple check: does the bundle string contain the product ID?
    // We can refine this to be more precise if IDs are substrings of each other
    return allProducts.filter(p =>
        p.category === 'Bundle' &&
        p.bundleItems &&
        (p.bundleItems.toLowerCase().includes(productId) ||
            p.bundleItems.toLowerCase().includes(product.name.toLowerCase()))
    );
};
