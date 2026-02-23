import { useState, useEffect } from 'react';
import AdminGuard from './AdminGuard';
import { getOrders, updateOrderStatus } from '../../lib/orders';
import { formatPrice } from '../../data/supabase-products';

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const data = await getOrders();
            setOrders(data || []);
        } catch (e) {
            console.error('Error loading orders:', e);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStatusChange(orderId: string, newStatus: string) {
        setUpdating(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
        } catch (e) {
            console.error('Error updating order status:', e);
            alert('Error al actualizar el estado del pedido.');
        } finally {
            setUpdating(null);
        }
    }

    return (
        <AdminGuard currentPage="pedidos">
            <div className="admin-page-header">
                <h1>Pedidos</h1>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    {orders.length} pedidos en total
                </span>
            </div>

            {isLoading ? (
                <div className="admin-loading">
                    <div className="spinner" />
                    <p>Cargando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="admin-table-wrap" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <span style={{ fontSize: '2rem' }}>📦</span>
                    <p style={{ marginTop: '0.5rem' }}>Aún no hay pedidos.</p>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Email</th>
                                <th>Artículos</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <>
                                    <tr key={order.id} style={{ cursor: 'pointer' }}
                                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                                        <td>{order.order_number || i + 1}</td>
                                        <td><strong>{order.customer_name}</strong></td>
                                        <td>{order.customer_email}</td>
                                        <td>{order.order_items?.length || 0}</td>
                                        <td><strong>{formatPrice(Number(order.total))}</strong></td>
                                        <td>
                                            <span className={`status-badge status-badge--${order.status}`}>
                                                {STATUS_LABELS[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.created_at).toLocaleDateString('es-MX', {
                                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}</td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <select
                                                className="status-select"
                                                value={order.status}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                disabled={updating === order.id}
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {expandedId === order.id && order.order_items && (
                                        <tr key={`${order.id}-items`}>
                                            <td colSpan={8}>
                                                <div className="order-items-expand">
                                                    <div style={{ marginBottom: '0.3rem' }}>
                                                        <strong>📍 Envío:</strong> {order.shipping_address}, {order.shipping_city}, {order.shipping_state} C.P. {order.shipping_zip}
                                                    </div>
                                                    <div style={{ marginBottom: '0.3rem' }}>
                                                        <strong>📞</strong> {order.customer_phone}
                                                        {order.notes && <> · <strong>Notas:</strong> {order.notes}</>}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                        {order.order_items.map((item: any) => (
                                                            <span key={item.id}>
                                                                {item.product_name} ×{item.quantity} = {formatPrice(Number(item.total_price))}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminGuard>
    );
}
