/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // ─── Stitch Professional Attendance System (M3-inspired) ───
        // Used by employee PWA screens generated via Google Stitch
        'stitch-primary': '#1f108e',
        'stitch-primary-container': '#3730a3',
        'stitch-on-primary': '#ffffff',
        'stitch-on-primary-container': '#a9a7ff',
        'stitch-surface': '#fcf8ff',
        'stitch-surface-dim': '#dcd8e3',
        'stitch-surface-bright': '#fcf8ff',
        'stitch-surface-container-lowest': '#ffffff',
        'stitch-surface-container-low': '#f6f2fc',
        'stitch-surface-container': '#f0ecf6',
        'stitch-surface-container-high': '#eae6f1',
        'stitch-surface-container-highest': '#e4e1eb',
        'stitch-on-surface': '#1b1b22',
        'stitch-on-surface-variant': '#464553',
        'stitch-surface-tint': '#544fc0',
        'stitch-outline': '#777584',
        'stitch-outline-variant': '#c8c4d5',
        'stitch-inverse-surface': '#303037',
        'stitch-inverse-on-surface': '#f3eff9',
        'stitch-inverse-primary': '#c3c0ff',
        'stitch-secondary': '#515f74',
        'stitch-on-secondary': '#ffffff',
        'stitch-secondary-container': '#d5e3fc',
        'stitch-on-secondary-container': '#57657a',
        'stitch-tertiary': '#511c00',
        'stitch-tertiary-container': '#752c00',
        'stitch-on-tertiary-container': '#fe9562',
        'stitch-error': '#ba1a1a',
        'stitch-error-container': '#ffdad6',
        'stitch-on-error': '#ffffff',
        'stitch-on-error-container': '#93000a',
        'stitch-success': '#34a853',
        'stitch-warning': '#f9ab00',
        'stitch-destructive': '#ea4335',
        'stitch-muted': '#9aa0a6',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem',
        '2xl': '1rem',
        'pill': '9999px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}