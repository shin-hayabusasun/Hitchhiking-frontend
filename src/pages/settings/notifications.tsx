// 通知設定画面（プッシュ通知等の受信設定）

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';
import { API_BASE_URL } from '@/config/api';

export function NotificationSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        rideRequest: true,
        message: true,
        reminder: true,
        promotion: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/me/notifications`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setSettings({
                        rideRequest: data.rideRequest ?? true,
                        message: data.message ?? true,
                        reminder: data.reminder ?? true,
                        promotion: data.promotion ?? false,
                    });
                }
            } catch (err) {
                setError('設定の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    async function handleSave() {
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/me/notifications`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(settings),
            });

            const data = await response.json();
            if (response.ok) {
                alert('通知設定を更新しました');
                router.push('/settings');
            } else {
                setError(data.message || '更新に失敗しました');
            }
        } catch (err) {
            setError('更新に失敗しました');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans text-slate-900">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <div className="max-w-2xl mx-auto min-h-screen flex flex-col bg-white shadow-sm relative">
                
                {/* ヘッダー */}
                <TitleHeader title="通知設定" backPath="/settings" />

                <main className="p-4 sm:p-6 flex-1 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900">通知設定</h2>
                        <p className="text-sm text-gray-500 mt-1 font-medium">受け取る通知の種類をカスタマイズできます</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* 設定リストカード */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                        {/* 項目: 同乗申請 */}
                        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="pr-4">
                                <h3 className="font-bold text-gray-800">同乗申請通知</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    同乗者からの申請があった際にプッシュ通知を受け取ります
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={settings.rideRequest}
                                    onChange={(e) => setSettings({ ...settings, rideRequest: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* 項目: メッセージ */}
                        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="pr-4">
                                <h3 className="font-bold text-gray-800">メッセージ通知</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    新しいメッセージが届いた際にお知らせします
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={settings.message}
                                    onChange={(e) => setSettings({ ...settings, message: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* 項目: リマインダー */}
                        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="pr-4">
                                <h3 className="font-bold text-gray-800">リマインダー</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    出発予定時刻が近づくと通知します
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={settings.reminder}
                                    onChange={(e) => setSettings({ ...settings, reminder: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* 項目: プロモーション */}
                        <div className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="pr-4">
                                <h3 className="font-bold text-gray-800">プロモーション</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    キャンペーンやお得な情報をいち早くお届けします
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={settings.promotion}
                                    onChange={(e) => setSettings({ ...settings, promotion: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* 下部アクションボタン */}
                    <div className="mt-auto pt-10 space-y-3">
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-600 text-white font-black p-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            設定を保存する
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="w-full bg-white text-gray-400 font-bold p-4 rounded-2xl border border-gray-100 hover:text-gray-600 transition-colors"
                        >
                            キャンセル
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default NotificationSettingsPage;