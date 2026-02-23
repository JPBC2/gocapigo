import { useState, useEffect, useRef } from 'react';
import { getUser, signOut, onAuthStateChange, isAdmin } from '../../lib/auth';

export default function UserMenu() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check initial auth state
        getUser().then(async u => {
            setUser(u);
            if (u) {
                const admin = await isAdmin(u.id);
                setIsUserAdmin(admin);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
            const u = session?.user || null;
            setUser(u);
            if (u) {
                const admin = await isAdmin(u.id);
                setIsUserAdmin(admin);
            } else {
                setIsUserAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            setIsOpen(false);
            window.location.href = '/';
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    if (isLoading) return null;

    // Not logged in — show login link
    if (!user) {
        return (
            <a href="/auth/login" className="navbar-login" aria-label="Iniciar sesión">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hide-mobile">Iniciar sesión</span>
            </a>
        );
    }

    // Logged in — show avatar + dropdown
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                className="user-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Menú de usuario"
            >
                <span className="user-avatar">{initial}</span>
                <span>Mi cuenta</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform 150ms', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="user-dropdown">
                    <div className="user-dropdown-header">
                        {user.email}
                    </div>
                    <div className="user-dropdown-divider" />
                    {isUserAdmin && (
                        <a href="/admin" className="user-dropdown-item" onClick={() => setIsOpen(false)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                            Panel Admin
                        </a>
                    )}
                    <button className="user-dropdown-item user-dropdown-item--danger" onClick={handleSignOut}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}

