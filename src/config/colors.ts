// ── Theme color application ───────────────────────────────────────────────────

/**
 * Given a hex string like '#1DAB70', derive a 7-stop brand scale and write
 * the CSS custom properties onto :root so the entire UI re-themes instantly.
 */
function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h = 0,
        s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function applyTheme(hex: string) {
    if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return;
    const [h, s, l] = hexToHsl(hex);
    const root = document.documentElement;
    // Brand scale: 500 = base, darken for 600/700, lighten for 400/300/200/100/50
    const stops: [string, number][] = [
        ['--brand-700', l - 22],
        ['--brand-600', l - 12],
        ['--brand-500', l],
        ['--brand-400', l + 12],
        ['--brand-300', l + 22],
        ['--brand-200', l + 35],
        ['--brand-100', l + 46],
        ['--brand-50', l + 52],
    ];
    stops.forEach(([varName, lightness]) => {
        root.style.setProperty(varName, hslToHex(h, s, Math.max(5, Math.min(95, lightness))));
    });
    root.style.setProperty('--color-success', hex);
    // Set --brand-rgb for rgba() use in phone-frame sandbox backgrounds
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    root.style.setProperty('--brand-rgb', `${r}, ${g}, ${b}`);
}
