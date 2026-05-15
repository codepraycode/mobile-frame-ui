import { useEffect, useState } from 'react';
import '../../styles/phone-frame.css';
import type { DeviceType } from './DeviceSwitcher';

interface PhoneFrameProps {
    theme: 'dark' | 'light';
    device?: DeviceType;
    children: React.ReactNode;
}

function StatusBarIcons() {
    return (
        <div className="phone-statusbar-icons">
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="1" opacity="0.4" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" opacity="0.6" />
                <rect x="9" y="3" width="3" height="9" rx="1" opacity="0.8" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" />
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                <path
                    d="M8 6C6.1 6 4.4 6.7 3.1 7.9l1.4 1.4C5.5 8.5 6.7 8 8 8s2.5.5 3.5 1.3l1.4-1.4C11.6 6.7 9.9 6 8 6z"
                    opacity="0.7"
                />
                <path
                    d="M8 2C5 2 2.3 3.2.4 5.2l1.4 1.4C3.4 4.9 5.6 4 8 4s4.6.9 6.2 2.6l1.4-1.4C13.7 3.2 11 2 8 2z"
                    opacity="0.4"
                />
            </svg>
            {/* Battery */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
                <rect
                    x="0"
                    y="1"
                    width="21"
                    height="10"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.4"
                />
                <rect x="1.5" y="2.5" width="16" height="7" rx="1.5" opacity="0.9" />
                <path d="M22.5 4.5v3a1.5 1.5 0 0 0 0-3z" opacity="0.5" />
            </svg>
        </div>
    );
}

function PhoneShell({ time, children }: { time: string; children: React.ReactNode }) {
    return (
        <div className="phone-shell">
            {/* Top chrome: notch + status bar */}
            <div className="phone-top-chrome">
                <div className="phone-notch">
                    <div className="phone-notch-camera" />
                </div>
                <div className="phone-statusbar">
                    <span className="phone-statusbar-time">{time}</span>
                    <StatusBarIcons />
                </div>
            </div>

            {/* App screen */}
            <div className="phone-screen">{children}</div>

            {/* Home bar */}
            <div className="phone-homebar">
                <div className="phone-homebar-indicator" />
            </div>
        </div>
    );
}

function TabletShell({ time, children }: { time: string; children: React.ReactNode }) {
    return (
        <div className="tablet-shell">
            {/* Top chrome: thin camera bar */}
            <div className="tablet-top-chrome">
                <div className="tablet-statusbar">
                    <span className="phone-statusbar-time">{time}</span>
                    <StatusBarIcons />
                </div>
                <div className="tablet-camera" />
            </div>

            {/* App screen */}
            <div className="phone-screen">{children}</div>

            {/* Home button */}
            <div className="tablet-homebar">
                <div className="tablet-home-btn" />
            </div>
        </div>
    );
}


export default function PhoneFrame({ theme, device = 'phone', children }: PhoneFrameProps) {
    const [time, setTime] = useState(() =>
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    useEffect(() => {
        const tick = () =>
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const id = setInterval(tick, 10_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="phone-sandbox" data-theme={theme} data-device={device}>
            {device === 'tablet' ? (
                <TabletShell time={time}>{children}</TabletShell>
            ) : (
                <PhoneShell time={time}>{children}</PhoneShell>
            )}
        </div>
    );
}
