/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Plus Jakarta Sans', 'sans-serif'],
                sans: ['Inter', 'DM Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'DM Mono', 'monospace'],
            },
            colors: {
                border: 'hsl(var(--border))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                brand: {
                    violet: '#7C3AED',
                    'violet-lt': '#A78BFA',
                    purple: '#9333EA',
                    fuchsia: '#D946EF',
                    cyan: '#06B6D4',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out both',
                'slide-up': 'slideUp 0.3s ease-out both',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'floatUp 3s ease-in-out infinite',
                'spin-slow': 'spin 2.5s linear infinite',
                'shimmer': 'shimmer 1.6s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(6px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 8px rgba(124,58,237,0.4)' },
                    '50%': { boxShadow: '0 0 24px rgba(124,58,237,0.8)' },
                },
                floatUp: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #D946EF 100%)',
                'gradient-brand-subtle': 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(217,70,239,0.08) 100%)',
                'gradient-card': 'linear-gradient(145deg, rgba(17,24,39,0.9) 0%, rgba(11,16,30,0.95) 100%)',
            },
            boxShadow: {
                'glow-violet': '0 0 24px rgba(124, 58, 237, 0.4)',
                'glow-violet-lg': '0 0 48px rgba(124, 58, 237, 0.5)',
                'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
                'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};