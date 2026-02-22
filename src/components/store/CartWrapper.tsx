import { CartProvider } from '../../context/CartContext';
import CartDrawer from './CartDrawer';
import type { ReactNode } from 'react';

interface CartWrapperProps {
    children: ReactNode;
}

/**
 * Wraps the page content with CartProvider and includes the CartDrawer.
 * Use this as a top-level React island in your Astro layout.
 */
export default function CartWrapper({ children }: CartWrapperProps) {
    return (
        <CartProvider>
            {children}
            <CartDrawer />
        </CartProvider>
    );
}
