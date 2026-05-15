import { useState, useEffect } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function MobileWarningOverlay({ theme }: { theme?: 'light' | 'dark' }) {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check screen width on mount and window resize
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!isSmallScreen || dismissed) return null;

    return (
        <div
            data-theme={theme}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'var(--bg)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                color: 'var(--text)',
            }}
        >
            <div
                style={{
                    maxWidth: 400,
                    width: '100%',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 32,
                    boxShadow: 'var(--shadow-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 16,
                }}
                className="animate-scale-in"
            >
                <IoInformationCircleOutline size={48} color="var(--brand-500)" />

                <h2
                    style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.2,
                    }}
                >
                    Desktop Optimized Demo
                </h2>
                <p
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-md)',
                        lineHeight: 1.5,
                        margin: 0,
                    }}
                >
                    This project is a <strong>makeshift demo</strong> of a mobile application. To
                    experience the full sandbox interface and phone-frame styling, please view this
                    app on a laptop or larger screen.
                </p>

                <button
                    onClick={() => setDismissed(true)}
                    style={{
                        marginTop: 8,
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'var(--brand-500)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        fontSize: 'var(--text-md)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--brand-600)')
                    }
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-500)')}
                >
                    Continue Anyway
                </button>
            </div>
        </div>
    );
}
