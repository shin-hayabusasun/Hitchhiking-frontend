// プロフィール設定画面

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

export function ProfileSettingsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        birthDate: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch('/api/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setFormData({
                        lastName: data.lastName || '',
                        firstName: data.firstName || '',
                        birthDate: data.birthDate || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || '',
                        password: '',
                        confirmPassword: '',
                    });
                }
            } catch (err) {
                setError('プロフィール情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    async function handleSave() {
        setError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }

        try {
            const response = await fetch('/api/users/me/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('プロフィールを更新しました');
                router.push('/settings');
            } else {
                setError('更新に失敗しました');
            }
        } catch (err) {
            setError('更新に失敗しました');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
                <p className="text-gray-500 font-medium">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-10">
            <div className="max-w-2xl mx-auto min-h-screen flex flex-col bg-white shadow-sm relative">
                
                {/* ヘッダー */}
                <TitleHeader title="プロフィール設定" backPath="/settings" />

                <main className="p-4 sm:p-6 flex-1">
                    <div className="mb-8 px-2">
                        <h2 className="text-2xl font-black text-gray-900">プロフィール情報</h2>
                        <p className="text-sm text-gray-500 mt-1 font-medium">基本情報を正確に入力してください</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium border border-red-100 mx-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* 姓名 */}
                        <div className="grid grid-cols-2 gap-4 px-2">
                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">姓</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">名</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* 生年月日 */}
                        <div className="px-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">生年月日</label>
                            <input
                                type="date"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all h-[58px]"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>

                        {/* メールアドレス */}
                        <div className="px-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">メールアドレス</label>
                            <input
                                type="email"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* 電話番号 */}
                        <div className="px-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">電話番号</label>
                            <input
                                type="tel"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* 住所 */}
                        <div className="px-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">住所</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        {/* セパレーター */}
                        <div className="py-6 px-2">
                            <div className="border-t border-gray-100"></div>
                        </div>

                        {/* パスワード変更 */}
                        <div className="px-2">
                            <h3 className="text-lg font-black text-gray-800 mb-4">パスワード変更</h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">新しいパスワード</label>
                                    <input
                                        type="password"
                                        placeholder="変更する場合のみ入力"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1 mb-1 block">パスワード（確認）</label>
                                    <input
                                        type="password"
                                        placeholder="確認のため再入力"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 下部アクションボタン */}
                    <div className="mt-12 space-y-3 px-2">
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-600 text-white font-black p-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            プロフィールを保存する
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

export default ProfileSettingsPage;