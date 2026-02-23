import { useState } from 'react';
import { signIn, signUp } from '../../lib/auth';

interface AuthFormProps {
    initialMode?: 'login' | 'register';
}

export default function AuthForm({ initialMode = 'login' }: AuthFormProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const switchMode = (newMode: 'login' | 'register') => {
        setMode(newMode);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (mode === 'register') {
            if (!fullName.trim()) {
                setError('Por favor ingresa tu nombre completo.');
                return;
            }
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }
        }

        setIsLoading(true);

        try {
            if (mode === 'login') {
                await signIn(email, password);
                window.location.href = '/';
            } else {
                const data = await signUp(email, password, fullName);
                if (data.user && !data.session) {
                    // Email confirmation required
                    setSuccess('¡Cuenta creada! Revisa tu correo electrónico para confirmar tu cuenta.');
                } else {
                    window.location.href = '/';
                }
            }
        } catch (err: any) {
            const msg = err?.message || 'Ocurrió un error. Intenta de nuevo.';
            // Translate common Supabase errors
            if (msg.includes('Invalid login credentials')) {
                setError('Correo o contraseña incorrectos.');
            } else if (msg.includes('User already registered')) {
                setError('Ya existe una cuenta con este correo electrónico.');
            } else if (msg.includes('Password should be at least')) {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (msg.includes('Email rate limit exceeded')) {
                setError('Demasiados intentos. Espera unos minutos e intenta de nuevo.');
            } else {
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h1>{mode === 'login' ? 'Bienvenida de vuelta' : 'Crear cuenta'}</h1>
                <p>{mode === 'login' ? 'Ingresa a tu cuenta Go Capi Go' : 'Únete a la comunidad K-Pop'}</p>
            </div>

            <div className="auth-tabs">
                <button
                    className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => switchMode('login')}
                    type="button"
                >
                    Iniciar sesión
                </button>
                <button
                    className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                    onClick={() => switchMode('register')}
                    type="button"
                >
                    Registrarse
                </button>
            </div>

            {error && (
                <div className="auth-message auth-message--error">
                    ⚠️ {error}
                </div>
            )}

            {success && (
                <div className="auth-message auth-message--success">
                    ✅ {success}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
                {mode === 'register' && (
                    <div>
                        <label htmlFor="fullName">Nombre completo</label>
                        <input
                            id="fullName"
                            className="input"
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Tu nombre completo"
                            required
                            autoComplete="name"
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        className="input"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        required
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        className="input"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                        required
                        minLength={6}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                </div>

                {mode === 'register' && (
                    <div>
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            id="confirmPassword"
                            className="input"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            required
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary btn-lg auth-submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? '⏳ Procesando...'
                        : mode === 'login'
                            ? 'Iniciar sesión'
                            : 'Crear cuenta'}
                </button>
            </form>

            <div className="auth-footer">
                {mode === 'login' ? (
                    <p>¿No tienes cuenta? <a href="/auth/registro">Regístrate aquí</a></p>
                ) : (
                    <p>¿Ya tienes cuenta? <a href="/auth/login">Inicia sesión</a></p>
                )}
            </div>
        </div>
    );
}
