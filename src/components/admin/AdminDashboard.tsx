import { useState, useEffect } from 'react';
import AdminGuard from './AdminGuard';
import { getOrders } from '../../lib/orders';
import { getProducts, formatPrice } from '../../data/supabase-products';

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

export default function AdminDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [ordersData, productsData] = await Promise.all([
                getOrders().catch(() => []),
                getProducts(),
            ]);
            setOrders(ordersData || []);
            setProducts(productsData);
        } catch (e) {
            console.error('Error loading dashboard data:', e);
        } finally {
            setIsLoading(false);
        }
    }

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockProducts = products.filter(p => p.stock <= 2 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const recentOrders = orders.slice(0, 5);

    return (
        <AdminGuard currentPage="dashboard">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
            </div>

            {isLoading ? (
                <div className="admin-loading">
                    <div className="spinner" />
                    <p>Cargando datos...</p>
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card__icon">📦</div>
                            <div className="stat-card__label">Pedidos totales</div>
                            <div className="stat-card__value">{orders.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">💰</div>
                            <div className="stat-card__label">Ingresos totales</div>
                            <div className="stat-card__value">{formatPrice(totalRevenue)}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">⏳</div>
                            <div className="stat-card__label">Pedidos pendientes</div>
                            <div className="stat-card__value">{pendingOrders}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">⚠️</div>
                            <div className="stat-card__label">Stock bajo / agotado</div>
                            <div className="stat-card__value">{lowStockProducts + outOfStock}</div>
                        </div>
                    </div>

                    <div className="admin-section-header">
                        <h2>Pedidos recientes</h2>
                        <a href="/admin/pedidos" className="btn btn-secondary btn-sm">Ver todos →</a>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="admin-table-wrap" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            Aún no hay pedidos.
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, i) => (
                                        <tr key={order.id}>
                                            <td>{order.order_number || i + 1}</td>
                                            <td>{order.customer_name}</td>
                                            <td>{formatPrice(Number(order.total))}</td>
                                            <td>
                                                <span className={`status-badge status-badge--${order.status}`}>
                                                    {STATUS_LABELS[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </AdminGuard>
    );
}
