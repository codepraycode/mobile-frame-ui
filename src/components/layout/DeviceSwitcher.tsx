import { useState, useEffect, useRef } from 'react';
import {
    IoPhonePortraitOutline,
    IoTabletPortraitOutline,
    IoReorderTwoOutline,
} from 'react-icons/io5';

export type DeviceType = 'phone' | 'tablet';

interface DeviceSwitcherProps {
    device: DeviceType;
    onSwitch: (d: DeviceType) => void;
    theme?: 'light' | 'dark';
}

const STORAGE_KEY = 'tmbot_switcher_pos';

const options: { id: DeviceType; label: string; Icon: typeof IoPhonePortraitOutline }[] = [
    { id: 'phone', label: 'Phone', Icon: IoPhonePortraitOutline },
    { id: 'tablet', label: 'Tablet', Icon: IoTabletPortraitOutline },
];

export default function DeviceSwitcher({ device, onSwitch, theme }: DeviceSwitcherProps) {
    const [pos, setPos] = useState({ x: 0, y: 0 }); // The actual dragged offset from initial CSS
    const [isDragging, setIsDragging] = useState(false);
    const [hasMoved, setHasMoved] = useState(false); // Used to differentiate click vs drag
    const [isLargeScreen, setIsLargeScreen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 1024 : true);

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const switcherRef = useRef<HTMLDivElement>(null);
    const initialPointer = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });

    // Initialize position from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // We'll enforce bounds again next tick if window is smaller, but this sets initial
                setPos(parsed);
                if (switcherRef.current) {
                    switcherRef.current.style.left = '0';
                    switcherRef.current.style.transform = 'none';
                }
            } catch (e) {
                // ignore
            }
        }
    }, []);

    // Effect to bind pointer move/up to window during a drag
    useEffect(() => {
        if (!isDragging) return;

        function handlePointerMove(e: PointerEvent) {
            e.preventDefault(); // prevent text selection etc.

            const dx = e.clientX - initialPointer.current.x;
            const dy = e.clientY - initialPointer.current.y;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                setHasMoved(true);
            }

            let newX = initialPos.current.x + dx;
            let newY = initialPos.current.y + dy;

            // Clamp to viewport
            if (switcherRef.current) {
                // Determine limits
                const rect = switcherRef.current.getBoundingClientRect();
                const safeMaxX = window.innerWidth - rect.width - 10;
                const safeMaxY = window.innerHeight - rect.height - 10;

                // Enforce margins (can't drag off top/left/right/bottom)
                newX = Math.max(10, Math.min(newX, safeMaxX));
                newY = Math.max(10, Math.min(newY, safeMaxY));
            }

            // Set position
            setPos({ x: newX, y: newY });
        }

        function handlePointerUp() {
            setIsDragging(false);
            if (hasMoved) {
                // Save to local storage
                setPos((current) => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
                    return current;
                });
            }
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, hasMoved]);

    const isDraggable = isLargeScreen;

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDraggable) return;

        // Quick visual/dom init when first dragged if missing absolute layout
        if (switcherRef.current && switcherRef.current.style.transform === '') {
            const rect = switcherRef.current.getBoundingClientRect();
            // Switch from center-transform to strict absolute coords
            switcherRef.current.style.transform = 'none';
            switcherRef.current.style.left = '0px';
            switcherRef.current.style.top = '0px';
            setPos({ x: rect.left, y: rect.top });
            initialPos.current = { x: rect.left, y: rect.top };
        } else {
            initialPos.current = { ...pos };
        }

        initialPointer.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        setHasMoved(false);
        (e.target as Element).setPointerCapture(e.pointerId);
    }

    return (
        <div
            ref={switcherRef}
            className={`device-switcher ${isDragging ? 'dragging' : ''} ${!isDraggable ? 'locked' : ''}`}
            data-theme={theme}
            onPointerDown={onPointerDown}
            style={{
                touchAction: 'none',
                // If we have a saved/dragged custom pos, use it over the CSS default (only in PC mode)
                ...(isDraggable && (pos.x || pos.y) ? { left: pos.x, top: pos.y, transform: 'none' } : {}),
                // Force center position if not in PC mode
                ...(!isDraggable ? { left: '50%', transform: 'translateX(-50%)', top: '20px' } : {}),
            }}
        >
            <div className="device-switcher-handle" aria-hidden="true" style={{ opacity: isDraggable ? 1 : 0, pointerEvents: isDraggable ? 'auto' : 'none' }}>
                <IoReorderTwoOutline size={16} />
            </div>

            {options.map(({ id, label, Icon }) => (
                <button
                    key={id}
                    className={`device-switcher-btn${device === id ? ' active' : ''}`}
                    onClick={(e) => {
                        // Prevent clicking if we just dragged it
                        if (hasMoved) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        onSwitch(id);
                    }}
                    aria-pressed={device === id}
                    title={`Switch to ${label} view`}
                >
                    <Icon size={16} />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}
