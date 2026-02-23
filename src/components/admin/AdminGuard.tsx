import { useState, useEffect, type ReactNode } from 'react';
import { getUser, isAdmin } from '../../lib/auth';

interface AdminGuardProps {
    children: ReactNode;
    currentPage?: string;
}

export default function AdminGuard({ children, currentPage = 'dashboard' }: AdminGuardProps) {
    const [state, setState] = useState<'loading' | 'denied' | 'allowed'>('loading');

    useEffect(() => {
        checkAdmin();
    }, []);

    async function checkAdmin() {
        const user = await getUser();
        if (!user) {
            window.location.href = '/auth/login';
            return;
        }
        const admin = await isAdmin(user.id);
        setState(admin ? 'allowed' : 'denied');
    }

    if (state === 'loading') {
        return (
            <div className="admin-loading">
                <div className="spinner" />
                <p>Verificando acceso...</p>
            </div>
        );
    }

    if (state === 'denied') {
        return (
            <div className="admin-denied">
                <span style={{ fontSize: '3rem' }}>🔒</span>
                <h2>Acceso denegado</h2>
                <p>No tienes permisos de administrador.</p>
                <a href="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Volver al inicio</a>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>⚙️ Admin</h2>
                </div>
                <nav className="admin-nav">
                    <a href="/admin" className={currentPage === 'dashboard' ? 'active' : ''}>
                        📊 Dashboard
                    </a>
                    <a href="/admin/pedidos" className={currentPage === 'pedidos' ? 'active' : ''}>
                        📦 Pedidos
                    </a>
                    <a href="/admin/productos" className={currentPage === 'productos' ? 'active' : ''}>
                        🏷️ Productos
                    </a>
                </nav>
            </aside>
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}
