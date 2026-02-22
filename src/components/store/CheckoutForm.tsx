import { useState, useEffect } from 'react';
import { formatPrice } from '../../data/supabase-products';
import { createOrder } from '../../lib/orders';
import type { CartItem } from '../../context/CartContext';

const CART_KEY = 'gocapigo-cart';

// Shipping zones for Mexico
const SHIPPING_ZONES = [
    { id: 'cdmx', label: 'CDMX y Área Metropolitana', price: 99 },
    { id: 'cercano', label: 'Estados cercanos (Edomex, Puebla, Morelos, Tlaxcala, Hidalgo, Querétaro)', price: 129 },
    { id: 'resto', label: 'Resto de México', price: 169 },
];

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    shippingZone: string;
    notes: string;
}

export default function CheckoutForm() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [form, setForm] = useState<FormData>({
        name: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
        shippingZone: 'cdmx', notes: '',
    });
    const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_KEY);
            setItems(stored ? JSON.parse(stored) : []);
        } catch { }
        setIsLoaded(true);
    }, []);

    if (!isLoaded) return null;

    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shipping = SHIPPING_ZONES.find(z => z.id === form.shippingZone)?.price || 99;
    const total = subtotal + shipping;
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    const updateField = (field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const isValid = form.name && form.email && form.phone && form.address && form.city && form.state && form.zip;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) setStep('confirm');
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setOrderError(null);

        try {
            await createOrder({
                customerName: form.name,
                customerEmail: form.email,
                customerPhone: form.phone,
                shippingAddress: form.address,
                shippingCity: form.city,
                shippingState: form.state,
                shippingZip: form.zip,
                shippingZone: form.shippingZone,
                shippingCost: shipping,
                subtotal,
                total,
                notes: form.notes || undefined,
                items: items.map(i => ({
                    productId: i.product.id,
                    productName: i.product.name,
                    quantity: i.quantity,
                    unitPrice: i.product.price,
                })),
            });

            localStorage.removeItem(CART_KEY);
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: 0 } }));
            setStep('success');
        } catch (err: any) {
            console.error('Error creating order:', err);
            setOrderError(err?.message || 'Hubo un error al procesar tu pedido. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && step !== 'success') {
        return (
            <div className="checkout-empty">
                <span style={{ fontSize: '3rem' }}>🛒</span>
                <h2>Tu carrito está vacío</h2>
                <p>Agrega productos antes de continuar al checkout.</p>
                <a href="/productos" className="btn btn-primary">Ver Catálogo</a>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="checkout-success">
                <span style={{ fontSize: '4rem' }}>🎉</span>
                <h2>¡Pedido recibido!</h2>
                <p>Gracias por tu compra. Te enviaremos los detalles de pago por correo electrónico a <strong>{form.email}</strong>.</p>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    También puedes contactarnos por Instagram <a href="https://instagram.com/go.capi.go" target="_blank" rel="noopener">@go.capi.go</a> si tienes alguna duda.
                </p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Volver al inicio</a>
            </div>
        );
    }

    return (
        <div className="checkout-layout">
            {/* Order Summary Sidebar */}
            <aside className="checkout-summary">
                <h3>Resumen del pedido</h3>
                <ul className="checkout-items">
                    {items.map(({ product, quantity }) => (
                        <li key={product.id} className="checkout-item">
                            <div className="checkout-item__info">
                                <span className="checkout-item__name">{product.name}</span>
                                <span className="checkout-item__qty">x{quantity}</span>
                            </div>
                            <span className="checkout-item__price">{formatPrice(product.price * quantity)}</span>
                        </li>
                    ))}
                </ul>
                <div className="checkout-totals">
                    <div className="checkout-row">
                        <span>Subtotal ({itemCount} artículos)</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="checkout-row">
                        <span>Envío ({SHIPPING_ZONES.find(z => z.id === form.shippingZone)?.label.split('(')[0].trim()})</span>
                        <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="checkout-row checkout-row--total">
                        <span>Total</span>
                        <span className="checkout-total-price">{formatPrice(total)}</span>
                    </div>
                </div>
            </aside>

            {/* Checkout Form */}
            <div className="checkout-form-area">
                {step === 'form' ? (
                    <form onSubmit={handleSubmit}>
                        <h3>Información de envío</h3>

                        <div className="form-grid">
                            <div className="form-group form-full">
                                <label htmlFor="name">Nombre completo *</label>
                                <input id="name" className="input" type="text" required
                                    value={form.name} onChange={e => updateField('name', e.target.value)}
                                    placeholder="Tu nombre completo" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico *</label>
                                <input id="email" className="input" type="email" required
                                    value={form.email} onChange={e => updateField('email', e.target.value)}
                                    placeholder="correo@ejemplo.com" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Teléfono *</label>
                                <input id="phone" className="input" type="tel" required
                                    value={form.phone} onChange={e => updateField('phone', e.target.value)}
                                    placeholder="55 1234 5678" />
                            </div>

                            <div className="form-group form-full">
                                <label htmlFor="address">Dirección completa *</label>
                                <input id="address" className="input" type="text" required
                                    value={form.address} onChange={e => updateField('address', e.target.value)}
                                    placeholder="Calle, número, colonia" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">Ciudad *</label>
                                <input id="city" className="input" type="text" required
                                    value={form.city} onChange={e => updateField('city', e.target.value)}
                                    placeholder="Ciudad" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="state">Estado *</label>
                                <input id="state" className="input" type="text" required
                                    value={form.state} onChange={e => updateField('state', e.target.value)}
                                    placeholder="Estado" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="zip">Código postal *</label>
                                <input id="zip" className="input" type="text" required
                                    value={form.zip} onChange={e => updateField('zip', e.target.value)}
                                    placeholder="00000" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="shippingZone">Zona de envío</label>
                                <select id="shippingZone" className="input"
                                    value={form.shippingZone} onChange={e => updateField('shippingZone', e.target.value)}>
                                    {SHIPPING_ZONES.map(zone => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.label} — {formatPrice(zone.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group form-full">
                                <label htmlFor="notes">Notas del pedido (opcional)</label>
                                <textarea id="notes" className="input" rows={3}
                                    value={form.notes} onChange={e => updateField('notes', e.target.value)}
                                    placeholder="Instrucciones especiales, referencias de entrega, etc." />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}
                            disabled={!isValid}>
                            Revisar pedido →
                        </button>
                    </form>
                ) : (
                    <div className="checkout-confirm">
                        <h3>Confirma tu pedido</h3>
                        <div className="confirm-details">
                            <div className="confirm-section">
                                <h4>Datos de contacto</h4>
                                <p>{form.name}</p>
                                <p>{form.email} · {form.phone}</p>
                            </div>
                            <div className="confirm-section">
                                <h4>Dirección de envío</h4>
                                <p>{form.address}</p>
                                <p>{form.city}, {form.state} C.P. {form.zip}</p>
                            </div>
                            {form.notes && (
                                <div className="confirm-section">
                                    <h4>Notas</h4>
                                    <p>{form.notes}</p>
                                </div>
                            )}
                            <div className="confirm-section">
                                <h4>Total a pagar</h4>
                                <p className="confirm-total">{formatPrice(total)}</p>
                            </div>
                        </div>

                        {orderError && (
                            <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '1rem', color: '#ff6b6b', fontSize: '0.9rem' }}>
                                ⚠️ {orderError}
                            </div>
                        )}

                        <div className="confirm-payment-note">
                            <p>💳 Al confirmar, te enviaremos por correo las instrucciones de pago vía Mercado Pago o transferencia bancaria.</p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-secondary btn-lg" onClick={() => setStep('form')} style={{ flex: 1 }}
                                disabled={isSubmitting}>
                                ← Editar datos
                            </button>
                            <button className="btn btn-gold btn-lg" onClick={handleConfirm} style={{ flex: 1 }}
                                disabled={isSubmitting}>
                                {isSubmitting ? '⏳ Procesando...' : '✓ Confirmar pedido'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
