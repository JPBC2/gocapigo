import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';
import { CartProvider } from '../../context/CartContext';
import type { Product } from '../../data/products';

interface ProductGridProps {
    products: Product[];
}

/**
 * A self-contained product grid with cart functionality.
 * Wraps ProductCards in CartProvider so they can use addItem.
 */
export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <CartProvider>
            <div className="products-grid-react">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <CartDrawer />
        </CartProvider>
    );
}
