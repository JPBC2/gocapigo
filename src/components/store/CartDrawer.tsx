import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/supabase-products';
import './CartDrawer.css';

export default function CartDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeItem, updateQuantity, clearCart, itemCount, total } = useCart();

    // Listen for cart toggle from Navbar
    if (typeof window !== 'undefined') {
        window.addEventListener('toggle-cart', () => setIsOpen(prev => !prev));
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}

            {/* Drawer */}
            <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
                <div className="cart-drawer__header">
                    <h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Carrito ({itemCount})
                    </h2>
                    <button className="cart-drawer__close" onClick={() => setIsOpen(false)} aria-label="Cerrar carrito">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="cart-drawer__body">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <span className="cart-empty__icon">🛒</span>
                            <p>Tu carrito está vacío</p>
                            <a href="/productos" className="btn btn-secondary btn-sm">Explorar productos</a>
                        </div>
                    ) : (
                        <ul className="cart-items">
                            {items.map(({ product, quantity }) => (
                                <li key={product.id} className="cart-item">
                                    <div className="cart-item__image">
                                        <span className="cart-item__emoji">
                                            {product.category === 'lightsticks' ? '🔦' :
                                                product.category === 'sleeves' ? '🃏' :
                                                    product.category === 'papeleria' ? '✏️' :
                                                        product.category === 'merchandise' ? '🛍️' : '🎀'}
                                        </span>
                                    </div>
                                    <div className="cart-item__info">
                                        <a href={`/productos/${product.slug}`} className="cart-item__name">{product.name}</a>
                                        <span className="cart-item__artist">{product.artist}</span>
                                        <span className="cart-item__price">{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="cart-item__actions">
                                        <div className="cart-item__qty">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                aria-label="Reducir cantidad"
                                            >−</button>
                                            <span>{quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                                disabled={quantity >= product.stock}
                                                aria-label="Aumentar cantidad"
                                            >+</button>
                                        </div>
                                        <button
                                            className="cart-item__remove"
                                            onClick={() => removeItem(product.id)}
                                            aria-label={`Remover ${product.name}`}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-drawer__footer">
                        <div className="cart-total">
                            <span>Total</span>
                            <span className="cart-total__price">{formatPrice(total)}</span>
                        </div>
                        <a href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Proceder al pago
                        </a>
                        <button className="btn btn-secondary btn-sm" onClick={clearCart} style={{ width: '100%', marginTop: '0.5rem' }}>
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
