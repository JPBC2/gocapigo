// Product data extracted from COMPRAS.xlsx (STOCK 15-5-24)
// Categories are inferred from product names

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number; // MXN
    stock: number;
    category: 'lightsticks' | 'accesorios' | 'photocards' | 'sleeves' | 'papeleria' | 'merchandise';
    artist: string;
    image?: string;
    description?: string;
    isNew?: boolean;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

const rawProducts: Omit<Product, 'id' | 'slug'>[] = [
    // Lightsticks
    { name: 'Army Bomb', price: 1200, stock: 1, category: 'lightsticks', artist: 'BTS', description: 'Lightstick oficial de BTS (Army Bomb). Conéctalo con la app Weverse para sincronizarlo en conciertos.' },

    // Accesorios
    { name: 'Pulsera PTD DIY', price: 350, stock: 1, category: 'accesorios', artist: 'BTS', description: 'Kit DIY para crear tu propia pulsera del tour Permission to Dance.' },
    { name: 'Llavero ballena', price: 300, stock: 2, category: 'accesorios', artist: 'BTS', description: 'Llavero con diseño de ballena del universo BTS.' },
    { name: 'Llavero Jin FESTA 2020', price: 180, stock: 3, category: 'accesorios', artist: 'BTS - Jin', description: 'Llavero exclusivo de Jin del FESTA 2020.' },
    { name: 'Llavero JK FESTA 2020', price: 180, stock: 3, category: 'accesorios', artist: 'BTS - Jungkook', description: 'Llavero exclusivo de Jungkook del FESTA 2020.' },
    { name: 'Pasaporte MANG', price: 200, stock: 5, category: 'accesorios', artist: 'BTS - J-Hope', description: 'Funda de pasaporte con diseño del personaje MANG de BT21.' },
    { name: 'Termo PTD Pop-Up', price: 250, stock: 3, category: 'accesorios', artist: 'BTS', description: 'Termo oficial del Pop-Up Store Permission to Dance.' },

    // Sets
    { name: 'SET Hobi-OTS', price: 1000, stock: 1, category: 'merchandise', artist: 'BTS - J-Hope', description: 'Set exclusivo de J-Hope del On The Street pop-up. Coleccionable limitado.' },

    // Card Holders
    { name: 'Card holder TinyTAN ToyStory JK', price: 345, stock: 2, category: 'accesorios', artist: 'BTS - Jungkook', description: 'Porta tarjetas TinyTAN x Toy Story edición Jungkook.' },
    { name: 'Card holder TinyTAN ToyStory Jin', price: 345, stock: 2, category: 'accesorios', artist: 'BTS - Jin', description: 'Porta tarjetas TinyTAN x Toy Story edición Jin.' },
    { name: 'Card holder TinyTAN ToyStory RM', price: 345, stock: 2, category: 'accesorios', artist: 'BTS - RM', description: 'Porta tarjetas TinyTAN x Toy Story edición RM.' },

    // Sleeves
    { name: 'Sleeve Holográfica diamante', price: 60, stock: 5, category: 'sleeves', artist: 'General', description: 'Sleeve holográfica con patrón de diamantes para proteger tus photocards.' },
    { name: 'Sleeve Holográfica estrella', price: 60, stock: 5, category: 'sleeves', artist: 'General', description: 'Sleeve holográfica con patrón de estrellas para proteger tus photocards.' },
    { name: 'Sleeve popcorn morada', price: 75, stock: 20, category: 'sleeves', artist: 'General', description: 'Sleeve decorativa con diseño de palomitas en color morado.' },
    { name: 'Sleeve popcorn verde', price: 80, stock: 10, category: 'sleeves', artist: 'General', description: 'Sleeve decorativa con diseño de palomitas en color verde.' },

    // Plumas TinyTAN
    { name: 'Pluma TinyTAN ToyStory RM', price: 300, stock: 2, category: 'papeleria', artist: 'BTS - RM', description: 'Pluma coleccionable TinyTAN x Toy Story edición RM.' },
    { name: 'Pluma TinyTAN ToyStory Jin', price: 300, stock: 2, category: 'papeleria', artist: 'BTS - Jin', description: 'Pluma coleccionable TinyTAN x Toy Story edición Jin.' },
    { name: 'Pluma TinyTAN ToyStory Suga', price: 300, stock: 2, category: 'papeleria', artist: 'BTS - Suga', description: 'Pluma coleccionable TinyTAN x Toy Story edición Suga.' },
    { name: 'Pluma TinyTAN ToyStory Hobi', price: 300, stock: 2, category: 'papeleria', artist: 'BTS - J-Hope', description: 'Pluma coleccionable TinyTAN x Toy Story edición J-Hope.' },
    { name: 'Pluma TinyTAN ToyStory Jimin', price: 300, stock: 1, category: 'papeleria', artist: 'BTS - Jimin', description: 'Pluma coleccionable TinyTAN x Toy Story edición Jimin.' },
    { name: 'Pluma TinyTAN ToyStory V', price: 300, stock: 2, category: 'papeleria', artist: 'BTS - V', description: 'Pluma coleccionable TinyTAN x Toy Story edición V.' },
    { name: 'Pluma TinyTAN ToyStory JK', price: 300, stock: 1, category: 'papeleria', artist: 'BTS - Jungkook', description: 'Pluma coleccionable TinyTAN x Toy Story edición Jungkook.' },

    // Binders
    { name: 'Binder corazón', price: 150, stock: 3, category: 'accesorios', artist: 'General', description: 'Binder con diseño de corazón para organizar tus photocards.' },
    { name: 'Hojas para binder', price: 60, stock: 10, category: 'accesorios', artist: 'General', description: 'Hojas transparentes compatibles con binder, 9 bolsillos por hoja.' },
];

export const products: Product[] = rawProducts.map((p, i) => ({
    ...p,
    id: `prod-${String(i + 1).padStart(3, '0')}`,
    slug: slugify(p.name),
}));

export const categories = [
    { id: 'lightsticks', label: 'Lightsticks', icon: '🔦', count: products.filter(p => p.category === 'lightsticks').length },
    { id: 'accesorios', label: 'Accesorios', icon: '🎀', count: products.filter(p => p.category === 'accesorios').length },
    { id: 'sleeves', label: 'Sleeves', icon: '🃏', count: products.filter(p => p.category === 'sleeves').length },
    { id: 'papeleria', label: 'Papelería', icon: '✏️', count: products.filter(p => p.category === 'papeleria').length },
    { id: 'merchandise', label: 'Merchandise', icon: '🛍️', count: products.filter(p => p.category === 'merchandise').length },
];

export function getProductBySlug(slug: string): Product | undefined {
    return products.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
    return products.filter(p => p.category === category);
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
