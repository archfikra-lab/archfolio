'use client';

import { useState, useRef, useEffect } from 'react';

const mockNotifications = [
    { id: '1', type: 'review', message: 'Your project "Al-Nour Tower" has been approved by Expert Panel.', time: '2 hours ago', read: false },
    { id: '2', type: 'comment', message: 'Dr. Karim left a review note on "Amman Cultural Center".', time: '5 hours ago', read: false },
    { id: '3', type: 'system', message: 'New submission guidelines updated. Please review before next upload.', time: '1 day ago', read: true },
    { id: '4', type: 'award', message: 'Congratulations! "Desert Pavilion" was nominated for Best Sustainable Design.', time: '2 days ago', read: true },
];

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'review': return 'verified';
            case 'comment': return 'chat';
            case 'system': return 'info';
            case 'award': return 'emoji_events';
            default: return 'notifications';
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'review': return 'text-[var(--electric-teal)]';
            case 'comment': return 'text-[var(--deep-teal)]';
            case 'system': return 'text-[var(--paper-plane-grey)]';
            case 'award': return 'text-[var(--mustard-gold)]';
            default: return 'text-[var(--paper-plane-grey)]';
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative w-10 h-10 border border-[var(--ink-line)] flex items-center justify-center hover:border-[var(--mustard-gold)] transition-colors"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined text-[var(--paper-plane-grey)] text-xl">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--mustard-gold)] text-black text-[9px] font-bold flex items-center justify-center rounded-full animate-pulse-subtle">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 bg-[var(--card-bg)] border border-[var(--ink-line)] shadow-2xl z-50 animate-[fadeInUp_0.2s_ease]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ink-line)]">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--deep-teal)]">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-[10px] uppercase tracking-widest text-[var(--electric-teal)] hover:underline font-bold">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                            <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-[var(--ink-line)]/50 hover:bg-[var(--platinum-sheen)]/10 transition-colors cursor-pointer ${!n.read ? 'bg-[var(--deep-teal)]/5' : ''}`}>
                                <span className={`material-symbols-outlined text-lg mt-0.5 ${getIconColor(n.type)}`}>{getIcon(n.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs leading-relaxed ${!n.read ? 'text-[var(--deep-teal)] font-medium' : 'text-[var(--paper-plane-grey)]'}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-[9px] text-[var(--paper-plane-grey)] mt-1 uppercase tracking-widest">{n.time}</p>
                                </div>
                                {!n.read && (
                                    <div className="w-2 h-2 bg-[var(--electric-teal)] rounded-full mt-1 flex-shrink-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2 text-center border-t border-[var(--ink-line)]">
                        <button className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] font-bold transition-colors">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
