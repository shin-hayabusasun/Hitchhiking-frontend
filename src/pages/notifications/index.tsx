import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
            const response = await fetch('http://54.165.126.189:8000/api/notifications', {
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
            const response = await fetch(`http://54.165.126.189:8000/api/notifications/${id}/read`, {
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
            const response = await fetch('/api/notifications/read-all', {
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

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                {/* スマホ風コンテナ */}
                <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-100 to-white overflow-hidden rounded-[3rem]">
                    
                    {/* ヘッダー */}
                    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">通知</h1>
                        <div className="w-10 flex justify-end">
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="全て既読">
                                    <CheckCheck size={20} />
                                </button>
                            )}
                        </div>
                    </header>

                    {/* フィルターバー */}
                    <div className="flex gap-2 p-3 bg-white/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'all', label: 'すべて' },
                            { id: 'unread', label: `未読${unreadCount > 0 ? `(${unreadCount})` : ''}` },
                            { id: 'request', label: '申請' },
                            { id: 'message', label: 'メッセージ' },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                                    filter === f.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-500 border border-gray-200'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* メインリスト */}
                    <main className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-3">
                                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                                <p className="text-gray-400 text-xs font-bold">読み込み中...</p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Bell size={48} className="opacity-20 mb-3" />
                                <p className="text-sm font-bold">通知はありません</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`flex gap-3 p-4 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer ${
                                        notif.isRead 
                                        ? 'bg-white/60 border-gray-100' 
                                        : 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                        {getNotificationIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-[13px] font-bold truncate ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {notif.title}
                                            </h3>
                                            {!notif.isRead && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-[12px] text-gray-500 leading-relaxed mb-2">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center text-[10px] text-gray-400 font-medium">
                                            <Clock size={12} className="mr-1" />
                                            {notif.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="h-10" />
                    </main>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;