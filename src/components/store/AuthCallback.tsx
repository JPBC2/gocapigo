import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const ERROR_MESSAGES: Record<string, string> = {
    otp_expired: 'El enlace de confirmación ha expirado.',
    access_denied: 'El enlace de acceso no es válido.',
    invalid_request: 'Solicitud no válida.',
};

export default function AuthCallback() {
    const [error, setError] = useState<{ code: string; description: string } | null>(null);
    const [email, setEmail] = useState('');
    const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;

        const params = new URLSearchParams(hash.substring(1));
        const errorCode = params.get('error_code');
        const errorDesc = params.get('error_description');

        if (errorCode) {
            setError({
                code: errorCode,
                description: errorDesc?.replace(/\+/g, ' ') || 'Ocurrió un error.',
            });
            // Clean the hash without reloading
            history.replaceState(null, '', window.location.pathname);
        }
    }, []);

    async function handleResend() {
        if (!email.trim()) return;
        setResendState('sending');
        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email.trim(),
            });
            if (resendError) throw resendError;
            setResendState('sent');
        } catch (e) {
            console.error('Resend error:', e);
            setResendState('error');
        }
    }

    if (!error) return null;

    const friendlyMessage = ERROR_MESSAGES[error.code] || error.description;

    return (
        <div className="auth-callback-overlay" onClick={() => setError(null)}>
            <div className="auth-callback-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-callback-close" onClick={() => setError(null)} aria-label="Cerrar">✕</button>

                <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                <h2>{friendlyMessage}</h2>

                {error.code === 'otp_expired' && (
                    <div className="auth-callback-resend">
                        {resendState === 'sent' ? (
                            <div className="auth-message auth-message--success">
                                ✅ ¡Correo enviado! Revisa tu bandeja de entrada.
                            </div>
                        ) : (
                            <>
                                <p>Ingresa tu correo para recibir un nuevo enlace de confirmación:</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                    <input
                                        className="input"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleResend()}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleResend}
                                        disabled={resendState === 'sending' || !email.trim()}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {resendState === 'sending' ? '...' : 'Reenviar'}
                                    </button>
                                </div>
                                {resendState === 'error' && (
                                    <div className="auth-message auth-message--error" style={{ marginTop: '0.5rem' }}>
                                        No se pudo enviar. Intenta de nuevo o regístrate nuevamente.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <a href="/auth/login" className="btn btn-secondary btn-sm">Iniciar sesión</a>
                    <a href="/auth/registro" className="btn btn-primary btn-sm">Registrarse</a>
                </div>
            </div>
        </div>
    );
}
