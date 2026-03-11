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
                surface: {
                    DEFAULT: '#ffffff',
                    muted: '#f8fafc',
                    card: '#ffffff'
                },
                text: {
                    main: '#0f172a',
                    muted: '#64748b'
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
