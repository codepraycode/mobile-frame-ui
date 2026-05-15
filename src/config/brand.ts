// ─── Brand Config ──────────────────────────────────────────────────────────────
//
// Single source of truth for all white-label customization.
// All values are driven from VITE_* environment variables — no code edits needed
// for a standard brand deployment.
//
// Usage:
//   import { brand } from '../config/brand';
//   brand.appName  // 'Automedic'
//   brand.primaryColor  // '#e63946'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WelcomeOption {
    label: string;
}

export interface BrandConfig {
    /** Display name used in header, welcome screen, page title, etc. */
    appName: string;
    /** URL or public path to the brand logo shown in the welcome screen & sidebar */
    logoUrl: string;
    loadIconUrl: string;
    loadIconAltUrl: string;
    /** Hex color for the primary brand accent, e.g. '#e63946' */
    primaryColor: string;
    /** Whether to wrap the app in the Phone/Tablet/PC sandbox frames */
    enableDeviceFrames: boolean;
}



export function loadBrandConfig(): BrandConfig {
    const appName = import.meta.env.VITE_APP_NAME ?? 'Template App';
    return {
        appName,
        logoUrl: import.meta.env.VITE_LOGO_URL ?? '',
        loadIconUrl: import.meta.env.VITE_LOAD_ICON_URL ?? '/logo/sivvar-icon.png',
        loadIconAltUrl: import.meta.env.VITE_LOAD_ICON_ALT_URL ?? '/logo/sivvar-icon-grey.png',
        primaryColor: import.meta.env.VITE_PRIMARY_COLOR ?? '#1DAB70',
        enableDeviceFrames: import.meta.env.VITE_ENABLE_DEVICE_FRAMES !== 'false',
    };
}

// Singleton — evaluated once at startup
export const brand = loadBrandConfig();
