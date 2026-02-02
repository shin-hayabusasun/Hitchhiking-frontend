// % Start(稗田隼也)
// 通知画面: ロジックを維持し、画面サイズを拡張したUI

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '@/config/api';
import Head from 'next/head';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MessageCircle, 
  Mail, 
  Bell, 
  Info, 
  CheckCheck,
  Clock
} from 'lucide-react';

interface Notification {
    id: string;
    type: 'request' | 'approval' | 'message' | 'system';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    link?: string;
}

export const NotificationsPage: React.FC = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(getApiUrl('/api/notifications'), {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setNotifications(data.data);
            } else {
                setError(data.error || '通知の取得に失敗しました。');
            }
        } catch (err) {
            setError('ネットワークエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(getApiUrl(`/api/notifications/${id}/read`), {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
                );
            }
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(getApiUrl('/api/notifications/read-all'), {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            }
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            router.push(notification.link);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'request': return <Mail className="text-blue-500" size={20} />;
            case 'approval': return <CheckCircle2 className="text-green-500" size={20} />;
            case 'message': return <MessageCircle className="text-purple-500" size={20} />;
            case 'system': return <Bell className="text-orange-500" size={20} />;
            default: return <Info className="text-gray-500" size={20} />;
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.isRead;
        return notif.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <Head>
                <title>通知 | ヒッチハイクマッチング</title>
            </Head>

            {/* 背景とレイアウトの設定 */}
            <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex justify-center p-0 md:p-4 font-sans text-gray-800">
                
                {/* ★ サイズ変更：スマホ枠を外し、max-w-3xlに拡張 */}
                <div className="w-full max-w-3xl flex flex-col bg-white/40 shadow-sm md:rounded-[2rem] md:my-4 overflow-hidden relative">
                    
                    {/* ヘッダー：横幅に合わせて調整 */}
                    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 md:p-6 flex items-center justify-between">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-90">
                            <ArrowLeft size={24} className="text-gray-600" />
                        </button>
                        <h1 className="text-xl font-black text-gray-800">通知</h1>
                        <div className="w-12 flex justify-end">
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="全て既読">
                                    <CheckCheck size={24} />
                                </button>
                            )}
                        </div>
                    </header>

                    {/* フィルターバー：少しゆとりを持たせた配置 */}
                    <div className="flex gap-3 p-4 bg-white/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'all', label: 'すべて' },
                            { id: 'unread', label: `未読${unreadCount > 0 ? `(${unreadCount})` : ''}` },
                            { id: 'request', label: '申請' },
                            { id: 'message', label: 'メッセージ' },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-6 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                                    filter === f.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* メインリスト：画面サイズに応じてグリッド調整も可能なゆとりある配置 */}
                    <main className="flex-1 p-4 md:p-8 space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-black border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                                <p className="text-gray-400 text-sm font-black">読み込み中...</p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                                <Bell size={64} className="opacity-10 mb-4" />
                                <p className="text-base font-black">通知はありません</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`flex gap-4 p-5 rounded-[1.5rem] border transition-all active:scale-[0.99] cursor-pointer hover:shadow-md ${
                                            notif.isRead 
                                            ? 'bg-white/60 border-gray-100 opacity-80' 
                                            : 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-50'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                            {getNotificationIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-[15px] font-black truncate ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {notif.title}
                                                </h3>
                                                {!notif.isRead && (
                                                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5 ml-2" />
                                                )}
                                            </div>
                                            <p className="text-[13px] text-gray-500 leading-relaxed mb-3 font-medium">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center text-[11px] text-gray-400 font-black">
                                                <Clock size={14} className="mr-1.5" />
                                                {notif.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="h-10" />
                    </main>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;

// % End