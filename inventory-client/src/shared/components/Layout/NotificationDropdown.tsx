// src/shared/components/Layout/NotificationDropdown.tsx

import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../../modules/core/services/notification.service';
import { Notification } from '../../../modules/core/types';
import { Badge } from '../UI';
import { showError } from '../../utils/toast';

const NotificationDropdown: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        
        // Close dropdown on outside click
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await notificationService.getNotifications(1);
            setNotifications(response.notifications);
            setUnreadCount(response.notifications.filter(n => !n.is_read).length);
        } catch (error: any) {
            showError(error.message || 'Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error: any) {
            showError(error.message || 'Failed to mark notification as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => 
                prev.map(n => ({ ...n, is_read: true }))
            );
            setUnreadCount(0);
        } catch (error: any) {
            showError(error.message || 'Failed to mark all as read');
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons = {
            info: { icon: 'fa-circle-info', bg: 'bg-blue-50', text: 'text-blue-600' },
            success: { icon: 'fa-circle-check', bg: 'bg-emerald-50', text: 'text-emerald-600' },
            warning: { icon: 'fa-triangle-exclamation', bg: 'bg-amber-50', text: 'text-amber-600' },
            error: { icon: 'fa-circle-xmark', bg: 'bg-rose-50', text: 'text-rose-600' },
        };
        return icons[type as keyof typeof icons] || icons.info;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 transition-colors"
            >
                <i className="fas fa-bell text-sm" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="w-6 h-6 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8">
                                <i className="fas fa-bell-slash text-3xl text-slate-300 mb-3" />
                                <p className="text-sm text-slate-400">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => {
                                    const iconStyle = getNotificationIcon(notification.type);
                                    return (
                                        <button
                                            key={notification.id}
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left ${
                                                !notification.is_read ? 'bg-emerald-50/50' : ''
                                            }`}
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconStyle.bg} ${iconStyle.text}`}>
                                                <i className={`fas ${iconStyle.icon} text-xs`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;