import { useCart } from '../../context/CartContext';
import { formatPrice, type Product } from '../../data/products';

interface AddToCartButtonProps {
    product: Product;
    fullWidth?: boolean;
    showIcon?: boolean;
}

export default function AddToCartButton({ product, fullWidth = false, showIcon = true }: AddToCartButtonProps) {
    const { addItem, items } = useCart();
    const isOutOfStock = product.stock === 0;
    const cartItem = items.find(i => i.product.id === product.id);
    const isInCart = !!cartItem;

    const handleAdd = () => {
        if (!isOutOfStock) {
            addItem(product, 1);
        }
    };

    if (isOutOfStock) {
        return (
            <button className="btn btn-secondary" disabled style={fullWidth ? { width: '100%' } : {}}>
                Agotado
            </button>
        );
    }

    return (
        <button
            className={`btn ${isInCart ? 'btn-gold' : 'btn-primary'} ${fullWidth ? 'btn-lg' : ''}`}
            onClick={handleAdd}
            style={fullWidth ? { width: '100%' } : {}}
        >
            {showIcon && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {isInCart ? (
                        <polyline points="20 6 9 17 4 12" />
                    ) : (
                        <>
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </>
                    )}
                </svg>
            )}
            {isInCart ? `En carrito (${cartItem.quantity})` : 'Agregar al carrito'}
        </button>
    );
}
