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
                }
            }
        },
    },
    plugins: [],
}
