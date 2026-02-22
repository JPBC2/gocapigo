import { useCart } from '../../context/CartContext';
import { formatPrice, type Product } from '../../data/products';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const isLowStock = product.stock > 0 && product.stock <= 2;
    const isOutOfStock = product.stock === 0;

    return (
        <a href={`/productos/${product.slug}`} className="product-card">
            <div className="product-card__image">
                <div className="product-card__placeholder">
                    <span className="product-card__emoji">
                        {product.category === 'lightsticks' ? '🔦' :
                            product.category === 'sleeves' ? '🃏' :
                                product.category === 'papeleria' ? '✏️' :
                                    product.category === 'merchandise' ? '🛍️' : '🎀'}
                    </span>
                </div>
                {product.isNew && (
                    <span className="product-card__badge product-card__badge--new">Nuevo</span>
                )}
                {isLowStock && !isOutOfStock && (
                    <span className="product-card__badge product-card__badge--low">¡Últimas piezas!</span>
                )}
                {isOutOfStock && (
                    <span className="product-card__badge product-card__badge--out">Agotado</span>
                )}
            </div>
            <div className="product-card__info">
                <span className="product-card__artist">{product.artist}</span>
                <h3 className="product-card__name">{product.name}</h3>
                <div className="product-card__footer">
                    <span className="product-card__price">{formatPrice(product.price)}</span>
                    {!isOutOfStock && (
                        <button
                            className="product-card__cart-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem(product, 1);
                            }}
                            aria-label={`Agregar ${product.name} al carrito`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </a>
    );
}
