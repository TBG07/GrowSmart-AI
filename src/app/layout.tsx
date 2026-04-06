import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'GrowSmart AI — AI Content Copilot for Growth',
    description:
        'Generate platform-optimized social content, manage your content calendar, and track engagement analytics — all powered by AI.',
    icons: {
        icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                {children}
                <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fgrowsmart4445back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.17" />
                <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
            </body>
        </html>
    );
}