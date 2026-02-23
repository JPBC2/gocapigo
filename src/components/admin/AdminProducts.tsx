import { useState, useEffect } from 'react';
import AdminGuard from './AdminGuard';
import { getProducts, formatPrice } from '../../data/supabase-products';
import { supabase } from '../../lib/supabase';

const CATEGORY_LABELS: Record<string, string> = {
    lightsticks: 'Lightsticks',
    accesorios: 'Accesorios',
    photocards: 'Photocards',
    sleeves: 'Sleeves',
    papeleria: 'Papelería',
    merchandise: 'Merchandise',
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStock, setEditStock] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (e) {
            console.error('Error loading products:', e);
        } finally {
            setIsLoading(false);
        }
    }

    function startEdit(product: any) {
        setEditingId(product.id);
        setEditStock(String(product.stock));
        setEditPrice(String(product.price));
    }

    async function saveEdit(productId: string) {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    stock: parseInt(editStock),
                    price: parseFloat(editPrice),
                })
                .eq('id', productId);

            if (error) throw error;

            setProducts(prev => prev.map(p =>
                p.id === productId
                    ? { ...p, stock: parseInt(editStock), price: parseFloat(editPrice) }
                    : p
            ));
            setEditingId(null);
        } catch (e) {
            console.error('Error updating product:', e);
            alert('Error al actualizar el producto.');
        } finally {
            setSaving(false);
        }
    }

    function cancelEdit() {
        setEditingId(null);
    }

    function getStockClass(stock: number) {
        if (stock === 0) return 'stock-out';
        if (stock <= 2) return 'stock-low';
        return '';
    }

    return (
        <AdminGuard currentPage="productos">
            <div className="admin-page-header">
                <h1>Productos</h1>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    {products.length} productos
                </span>
            </div>

            {isLoading ? (
                <div className="admin-loading">
                    <div className="spinner" />
                    <p>Cargando productos...</p>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Artista</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <strong>{product.name}</strong>
                                        {product.isNew && <span className="badge badge-new" style={{ marginLeft: '0.5rem', fontSize: '0.6rem' }}>NUEVO</span>}
                                    </td>
                                    <td>{CATEGORY_LABELS[product.category] || product.category}</td>
                                    <td>{product.artist}</td>
                                    <td>
                                        {editingId === product.id ? (
                                            <input
                                                className="inline-edit"
                                                type="number"
                                                value={editPrice}
                                                onChange={e => setEditPrice(e.target.value)}
                                                min="0"
                                                step="1"
                                            />
                                        ) : (
                                            formatPrice(product.price)
                                        )}
                                    </td>
                                    <td>
                                        {editingId === product.id ? (
                                            <input
                                                className="inline-edit"
                                                type="number"
                                                value={editStock}
                                                onChange={e => setEditStock(e.target.value)}
                                                min="0"
                                                step="1"
                                            />
                                        ) : (
                                            <span className={getStockClass(product.stock)}>
                                                {product.stock === 0 ? 'Agotado' : product.stock}
                                                {product.stock > 0 && product.stock <= 2 && ' ⚠️'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {editingId === product.id ? (
                                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => saveEdit(product.id)}
                                                    disabled={saving}
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                                                >
                                                    {saving ? '...' : '✓'}
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={cancelEdit}
                                                    disabled={saving}
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => startEdit(product)}
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                                            >
                                                ✏️ Editar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminGuard>
    );
}
