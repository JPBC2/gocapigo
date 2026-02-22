import { supabase } from '../lib/supabase';

// Re-export the Product interface (same shape as before)
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    category: 'lightsticks' | 'accesorios' | 'photocards' | 'sleeves' | 'papeleria' | 'merchandise';
    artist: string;
    image_url?: string;
    description?: string;
    is_new?: boolean;
}

// ---------- Local fallback data ----------
import { products as localProducts, categories as localCategories } from './products';

// ---------- Supabase queries ----------

/** Fetch all active products from Supabase, fallback to local data */
export async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
            return data.map(mapDbProduct);
        }
    } catch (e) {
        console.warn('Supabase unavailable, using local data:', e);
    }
    // Fallback: convert local products to match interface
    return localProducts.map(p => ({
        ...p,
        image_url: p.image,
        is_new: p.isNew,
    }));
}

/** Fetch single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) throw error;
        if (data) return mapDbProduct(data);
    } catch (e) {
        console.warn('Supabase unavailable, using local data for slug:', slug);
    }
    const local = localProducts.find(p => p.slug === slug);
    return local ? { ...local, image_url: local.image, is_new: local.isNew } : null;
}

/** Fetch products by category */
export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .order('name');

        if (error) throw error;
        if (data && data.length > 0) return data.map(mapDbProduct);
    } catch {
        // fallback
    }
    return localProducts
        .filter(p => p.category === category)
        .map(p => ({ ...p, image_url: p.image, is_new: p.isNew }));
}

/** Get categories with product counts */
export async function getCategories() {
    const products = await getProducts();
    return [
        { id: 'lightsticks', label: 'Lightsticks', icon: '🔦', count: products.filter(p => p.category === 'lightsticks').length },
        { id: 'accesorios', label: 'Accesorios', icon: '🎀', count: products.filter(p => p.category === 'accesorios').length },
        { id: 'sleeves', label: 'Sleeves', icon: '🃏', count: products.filter(p => p.category === 'sleeves').length },
        { id: 'papeleria', label: 'Papelería', icon: '✏️', count: products.filter(p => p.category === 'papeleria').length },
        { id: 'merchandise', label: 'Merchandise', icon: '🛍️', count: products.filter(p => p.category === 'merchandise').length },
    ];
}

/** Format price in MXN */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

/** Get product image URL from Supabase Storage */
export function getProductImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
    return data.publicUrl;
}

// Map DB row to Product interface
function mapDbProduct(row: any): Product {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        price: Number(row.price),
        stock: row.stock,
        category: row.category,
        artist: row.artist,
        image_url: row.image_url,
        description: row.description,
        is_new: row.is_new,
    };
}
