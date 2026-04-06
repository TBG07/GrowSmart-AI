'use client';

import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Top gradient orb decoration */}
                <div
                    className="pointer-events-none fixed top-0 right-0 w-[600px] h-[400px] opacity-20"
                    style={{
                        background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.4) 0%, transparent 70%)',
                        zIndex: 0,
                    }}
                />
                <div
                    className="pointer-events-none fixed bottom-0 left-48 w-[500px] h-[300px] opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse at bottom left, rgba(6,182,212,0.5) 0%, transparent 70%)',
                        zIndex: 0,
                    }}
                />

                <div className="relative z-10 p-6 lg:p-8 max-w-screen-2xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
