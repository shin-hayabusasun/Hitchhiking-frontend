// % Start(AI Assistant)
// 本人確認画面（個人情報・セキュリティ設定）

import React, { useState, useEffect } from 'react'; // ★ Reactをインポート
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

// --- アイコン ---
const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export function IdentitySettingsPage() {
    const router = useRouter();
    // 環境に合わせてポート番号を確認してください
    const API_BASE_URL = 'http://localhost:8000'; 

    // --- State管理 ---
    const [file, setFile] = useState<File | null>(null);
    const [hasIdentityDoc, setHasIdentityDoc] = useState(false);

    // 基本情報
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    
    // 生年月日
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');

    // 連絡先
    const [email, setEmail] = useState('');

    // 住所（DBは address 1つだけなので、表示用には addressLine をメインで使います）
    const [zipCode, setZipCode] = useState('');
    const [prefecture, setPrefecture] = useState('');
    const [city, setCity] = useState('');
    const [addressLine, setAddressLine] = useState('');

    // パスワード
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI状態
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // --- 初期データ取得 (GET) ---
    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();

                    setLastName(data.lastName || '');
                    setFirstName(data.firstName || '');
                    setEmail(data.email || '');
                    
                    if (data.birthDate) {
                        const [y, m, d] = data.birthDate.split('-');
                        setBirthYear(y || '');
                        setBirthMonth(m ? String(parseInt(m)) : '');
                        setBirthDay(d ? String(parseInt(d)) : '');
                    }

                    // ★修正: 分割されたデータを受け取ってセットする
                    setZipCode(data.zipCode || '');
                    setPrefecture(data.prefecture || '');
                    setCity(data.city || '');
                    setAddressLine(data.address || ''); // ここは番地のみが入ってくる

                    setHasIdentityDoc(data.hasIdentityDoc || false);
                }
            } catch (err) {
                // ...
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    // --- ファイル選択ハンドラーの定義 ---
    // ★ここが大事！コンポーネント内で定義する
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
            setSuccessMsg('');
        }
    }

    // --- 保存処理 (PUT) ---
    const handleSaveAll = async () => {
        // ... (エラーリセットなどはそのまま) ...

        try {
            const promises = [];

            // 1. プロフィール更新
            let birthDateStr = '';
            if (birthYear && birthMonth && birthDay) {
                birthDateStr = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
            }

            // ★修正: 住所をスペース区切りで結合する
            // 結合例: "100-0001 東京都 千代田区 1-1-1"
            const fullAddress = `${zipCode} ${prefecture} ${city} ${addressLine}`.trim(); 

            const profileData = {
                lastName,
                firstName,
                birthDate: birthDateStr,
                email,
                address: fullAddress, // ★結合した住所を送る
                password: newPassword || undefined
            };

            const profilePromise = fetch(`${API_BASE_URL}/api/users/me/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profileData),
            }).then(async res => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.detail || 'プロフィールの更新に失敗しました');
                }
                return res.json();
            });
            promises.push(profilePromise);

            // 2. 書類アップロード (Hiedaさん仕様: Base64変換)
            if (file) {
                const reader = new FileReader();
                const filePromise = new Promise((resolve, reject) => {
                    reader.onload = async () => {
                        try {
                            const base64String = reader.result;
                            const res = await fetch(`${API_BASE_URL}/api/users/me/identity-document`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({ identification: base64String }),
                            });
                            if (!res.ok) throw new Error('画像のアップロードに失敗しました');
                            resolve(res.json());
                        } catch (err) {
                            reject(err);
                        }
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                promises.push(filePromise);
            }

            await Promise.all(promises);

            setSuccessMsg('変更を保存しました');
            setFile(null);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            // アップロード成功時にフラグを更新
            if (file) setHasIdentityDoc(true);
            
        } catch (err: any) {
            setError(err.message || '更新に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <p>読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto overflow-x-hidden">
                <TitleHeader title="プロフィール設定" backPath="/settings" />
                
                <main className="p-4 space-y-6 flex-1 pb-20"> 

                    {/* 説明ヘッダー */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
                        <div className="mt-1 bg-white p-1.5 rounded-full shadow-sm">
                            <UserIcon />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 text-sm">登録情報の変更</h2>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                名前や住所を変更できます。
                            </p>
                        </div>
                    </div>

                    {/* 基本情報 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-600 mb-4 font-medium">基本情報</h3>
                        
                        <div className="space-y-4">
                            {/* 氏名 */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">氏名</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="姓"
                                        className="flex-1 min-w-0 bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="名"
                                        className="flex-1 min-w-0 bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* 生年月日 */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">生年月日</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="number" 
                                        value={birthYear}
                                        onChange={(e) => setBirthYear(e.target.value)}
                                        placeholder="YYYY"
                                        className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none min-w-0"
                                    />
                                    <input 
                                        type="number" 
                                        value={birthMonth}
                                        onChange={(e) => setBirthMonth(e.target.value)}
                                        placeholder="MM"
                                        className="w-20 bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                    />
                                    <input 
                                        type="number" 
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                        placeholder="DD"
                                        className="w-20 bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 連絡先 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-600 mb-4 font-medium">連絡先</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">メールアドレス</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 住所 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-600 mb-4 font-medium">住所</h3>
                        <div className="space-y-4">
                            {/* 郵便番号などは入力してもDBに保存されませんが、UIとして残しておきます */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">郵便番号</label>
                                <input 
                                    type="text" 
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex-1 min-w-0">
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">都道府県</label>
                                    <input 
                                        type="text" 
                                        value={prefecture}
                                        onChange={(e) => setPrefecture(e.target.value)}
                                        className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">市区町村</label>
                                    <input 
                                        type="text" 
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                    />
                                </div>
                            </div>
                            {/* ★ここがメインの住所欄になります */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">番地・建物名</label>
                                <input 
                                    type="text" 
                                    value={addressLine}
                                    onChange={(e) => setAddressLine(e.target.value)}
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* パスワード変更 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-600 mb-4 font-medium">パスワード変更</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">現在のパスワード</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">新しいパスワード</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="変更する場合のみ入力"
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">新しいパスワード（確認）</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="確認のため再入力"
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 本人確認書類アップロード */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-600 mb-2 font-medium">本人確認書類</h3>
                        <p className="text-xs text-gray-500 mb-4">
                            運転免許証、パスポート、マイナンバーカードのいずれかをアップロードしてください
                        </p>
                        
                        <label className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                            <FileIcon />
                            <span className="text-gray-700 font-medium">
                                {file ? file.name : '書類をアップロード'}
                            </span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
                    {successMsg && <p className="text-green-500 text-sm font-bold text-center">{successMsg}</p>}

                    {/* 保存ボタン */}
                    <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-4 -mx-4 mb-[-1rem]">
                        <button 
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-50"
                        >
                            {isSaving ? '保存中...' : '変更を保存'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default IdentitySettingsPage;
// % End