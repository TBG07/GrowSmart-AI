'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Sparkles,
    CalendarDays,
    BarChart3,
    Mic2,
    ChevronLeft,
    ChevronRight,
    Zap,
    Bell,
    Settings,
    User,
} from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/content-generation', label: 'Generate', icon: Sparkles },
    { href: '/content-calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/analytics-dashboard', label: 'Analytics', icon: BarChart3 },
    { href: '/brand-voice', label: 'Brand Voice', icon: Mic2 },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className="sticky top-0 flex flex-col h-screen transition-all duration-300 select-none"
            style={{
                width: collapsed ? '68px' : '220px',
                background: 'rgba(8, 12, 24, 0.98)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5 overflow-hidden">
                <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#D946EF)' }}
                >
                    <Zap size={17} className="text-white" />
                </div>
                {!collapsed && (
                    <div className="animate-fade-in">
                        <p className="font-display font-bold text-white text-[15px] leading-none">GrowSmart</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#A78BFA' }}>AI Copilot</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto scrollbar-thin">
                {!collapsed && (
                    <p className="section-label px-3 mb-2">Navigation</p>
                )}
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? label : undefined}
                            className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                        >
                            <Icon size={17} className="flex-shrink-0" />
                            {!collapsed && <span className="truncate">{label}</span>}
                            {active && !collapsed && (
                                <span
                                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: '#7C3AED', boxShadow: '0 0 6px 2px rgba(124,58,237,0.7)' }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="px-2 py-3 space-y-0.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <button
                    title={collapsed ? 'Notifications' : undefined}
                    className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
                >
                    <Bell size={16} className="flex-shrink-0" />
                    {!collapsed && <span>Notifications</span>}
                    {!collapsed && (
                        <span className="ml-auto bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                    )}
                </button>
                <button
                    title={collapsed ? 'Settings' : undefined}
                    className={`nav-item w-full ${collapsed ? 'justify-center px-2' : ''}`}
                >
                    <Settings size={16} className="flex-shrink-0" />
                    {!collapsed && <span>Settings</span>}
                </button>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(p => !p)}
                    className="w-full mt-2 flex items-center justify-center py-2 rounded-xl transition-all duration-150"
                    style={{ color: 'rgba(148,163,184,0.6)' }}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                </button>

                {/* User avatar */}
                <div className={`flex items-center gap-2.5 px-2 pt-2 ${collapsed ? 'justify-center' : ''}`}>
                    <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)' }}
                    >
                        <User size={14} />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 animate-fade-in">
                            <p className="text-xs font-semibold text-white truncate">Your Account</p>
                            <p className="text-[10px] truncate" style={{ color: 'rgba(148,163,184,0.6)' }}>Pro Plan</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
