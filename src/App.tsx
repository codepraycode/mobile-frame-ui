import { useState, useEffect } from 'react';
import PhoneFrame from './components/layout/PhoneFrame';
import MobileWarningOverlay from './components/layout/MobileWarningOverlay';
import DeviceSwitcher from './components/layout/DeviceSwitcher';
import type { DeviceType } from './components/layout/DeviceSwitcher';
import DialogProvider from './components/layout/DialogProvider';
import { useTheme } from './hooks/useTheme';
import { brand } from './config/brand';
import './styles/global.css';
import { applyTheme } from './config/colors';

const viewport_size = {
    phone: 640,
    tablet: 1024,
};

export default function App() {
    const [device, setDevice] = useState<DeviceType>('phone');
    const [viewport, setViewport] = useState<'phone' | 'tablet' | 'pc'>('pc');

    // Track viewport size to auto-hide frames when they match the current screen
    useEffect(() => {
        const checkViewport = () => {
            const w = window.innerWidth;
            if (w <= viewport_size.phone) setViewport('phone');
            else if (w <= viewport_size.tablet) setViewport('tablet');
            else setViewport('pc');
        };

        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    const isFrameEnabled = brand.enableDeviceFrames && device !== viewport;

    const { theme, toggleTheme } = useTheme();

    // Apply brand theme
    useEffect(() => {
        applyTheme(brand.primaryColor);
    }, []);

    // ── Main app ───────────────────────────────────────────────────────────
    const appContent = (
        <DialogProvider>
            <div
                className={!isFrameEnabled ? 'no-frame-web-app' : ''}
                data-theme={theme}
                data-device={device}
                style={{
                    display: 'flex',
                    height: '100%',
                    overflow: 'auto',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{brand.appName}</h1>
                    <p>Build your next project here.</p>
                    <button
                        onClick={toggleTheme}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--primary)',
                            color: 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Toggle Theme ({theme})
                    </button>
                </div>
            </div>
        </DialogProvider>
    );

    return (
        <>
            {brand.enableDeviceFrames && (
                <DeviceSwitcher device={device} onSwitch={setDevice} theme={theme} />
            )}
            {isFrameEnabled ? (
                <PhoneFrame theme={theme} device={device}>
                    {appContent}
                </PhoneFrame>
            ) : (
                appContent
            )}
            {isFrameEnabled && <MobileWarningOverlay theme={theme} />}
        </>
    );
}
