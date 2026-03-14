/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // Easily adjustable semantic color palette
                primary: {
                    DEFAULT: '#2563eb', // text-primary, bg-primary
                    hover: '#1d4ed8',   // text-primary-hover
                    light: '#eff6ff',   // bg-primary-light
                },
                accent: {
                    DEFAULT: '#0ea5e9', // text-accent, bg-accent
                    hover: '#0284c7',
                },
                footer: {
                    DEFAULT: '#1f2937', // bg-footer (was gray-800)
                    border: '#374151',  // border-footer-border (was gray-700)
                },
                surface: {
                    DEFAULT: '#ffffff',
                    muted: '#f8fafc',
                    card: '#ffffff'
                },
                text: {
                    main: '#0f172a',
                    muted: '#64748b',
                    inverse: '#ffffff',
                    'inverse-muted': '#9ca3af', // text-text-inverse-muted (was gray-400)
                    'inverse-heading': '#e5e7eb' // text-text-inverse-heading (was gray-200)
                },
                border: {
                    DEFAULT: '#e2e8f0'
                },
                status: {
                    error: '#ef4444',
                    success: '#10b981'
                },
                admin: {
                    DEFAULT: '#7c3aed', // violet-600
                    hover: '#6d28d9',   // violet-700
                    light: '#f5f3ff',   // violet-50
                }
            },
            keyframes: {
                'progress-indeterminate': {
                    '0%': { transform: 'translateX(-100%) scaleX(0.2)' },
                    '50%': { transform: 'translateX(0%) scaleX(0.5)' },
                    '100%': { transform: 'translateX(100%) scaleX(0.2)' },
                },
                'pulse-skeleton': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                }
            },
            animation: {
                'progress-indeterminate': 'progress-indeterminate 2s infinite ease-in-out',
                'pulse-skeleton': 'pulse-skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            height: {
                'progress': '0.25rem', // 4px
            },
            zIndex: {
                'progress': '60',
            }
        },
    },
    plugins: [],
}
