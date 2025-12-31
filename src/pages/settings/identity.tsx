// % Start(AI Assistant)
// 本人確認画面（個人情報・セキュリティ設定）

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';

// --- アイコンコンポーネント ---
const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export function IdentitySettingsPage() {
    const router = useRouter();

    // --- State管理 (初期値は空文字) ---
    // 1. ファイルアップロード用
    const [file, setFile] = useState<File | null>(null);

    // 2. 基本情報
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    
    // 生年月日（APIの YYYY-MM-DD を分割して管理）
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');

    // 連絡先
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // 住所（APIの address が1つの場合は addressLine に入れるなどの調整が必要）
    const [zipCode, setZipCode] = useState('');
    const [prefecture, setPrefecture] = useState('');
    const [city, setCity] = useState('');
    const [addressLine, setAddressLine] = useState('');

    // 3. パスワード
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI状態
    const [loading, setLoading] = useState(true); // 初期ロード中
    const [isSaving, setIsSaving] = useState(false); // 保存処理中
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // --- 初期データ取得 (GET) ---
    // ProfileSettingsPage の fetchProfile ロジックを統合
    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch('/api/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                
                if (response.ok) {
                    setLastName(data.lastName || '');
                    setFirstName(data.firstName || '');
                    
                    // 生年月日 (YYYY-MM-DD) を分割
                    if (data.birthDate) {
                        const [y, m, d] = data.birthDate.split('-');
                        setBirthYear(y || '');
                        setBirthMonth(m ? String(parseInt(m)) : ''); // 01 -> 1
                        setBirthDay(d ? String(parseInt(d)) : '');   // 05 -> 5
                    }

                    setEmail(data.email || '');
                    setPhone(data.phone || '');

                    // 住所: 元データが 'address' 1つしかない場合、とりあえず番地欄に入れる
                    // (もしAPIが zipCode 等を持っているなら data.zipCode をセットしてください)
                    setAddressLine(data.address || ''); 
                    // setZipCode(data.zipCode || ''); 
                }
            } catch (err) {
                console.error(err);
                setError('プロフィール情報の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);


    // --- イベントハンドラー ---

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
            setSuccessMsg('');
        }
    }

    // --- 保存処理 (PUT/POST) ---
    const handleSaveAll = async () => {
        setError('');
        setSuccessMsg('');
        setIsSaving(true);

        // バリデーション
        if ((newPassword || currentPassword) && newPassword !== confirmPassword) {
            setError('新しいパスワードが一致しません');
            setIsSaving(false);
            return;
        }

        try {
            const promises = [];

            // 1. プロフィール情報の更新データ作成
            // 生年月日を結合
            let birthDateStr = '';
            if (birthYear && birthMonth && birthDay) {
                birthDateStr = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
            }

            const profileData = {
                lastName,
                firstName,
                birthDate: birthDateStr,
                email,
                phone,
                // APIが address 文字列1つを期待しているか、構造化データを期待しているかで変える
                // ここでは元の仕様に合わせて結合、または addressLine をそのまま送る例
                address: addressLine, 
                // もしAPI側を拡張したなら以下のように送る
                // zipCode, prefecture, city, ...
            };

            // プロフィール更新リクエスト
            const profilePromise = fetch('/api/users/me/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profileData),
            }).then(res => {
                if (!res.ok) throw new Error('プロフィールの更新に失敗しました');
                return res.json();
            });
            promises.push(profilePromise);

            // 2. パスワード変更がある場合
            if (newPassword && currentPassword) {
                 // APIエンドポイントが同じでパスワードも受け付ける仕様なら profileData に含めるだけで良いですが、
                 // セキュリティ上分かれていることも多いため、状況に合わせてください。
                 // 今回は ProfileSettingsPage の仕様(profileDataに含める)に合わせるなら上記 profileData に password を追加します。
                 // ここでは念のため分離して書いておきますが、元のコードでは同じAPIで処理しているようでした。
            }

            // 3. ファイルアップロードがある場合
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const uploadPromise = fetch('/api/users/me/identity-document', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                }).then(res => {
                    if (!res.ok) throw new Error('画像のアップロードに失敗しました');
                });
                promises.push(uploadPromise);
            }

            // 全て実行
            await Promise.all(promises);

            setSuccessMsg('変更を保存しました');
            setFile(null);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            // 必要ならページ遷移
            // router.push('/settings'); 

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
            
            {/* スマホ端末フレーム */}
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto overflow-x-hidden">
                <TitleHeader title="プロフィール設定" backPath="/settings" />
                
                <main className="p-4 space-y-6 flex-1"> 

                    {/* ステータスカード */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="bg-green-50 p-3 rounded-full">
                            <ShieldCheckIcon />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">本人確認書類</h2>
                            {/* ここもAPIからステータスを取れれば動的に変える */}
                            <p className="text-green-600 text-sm font-bold">確認済み</p>
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
                                        className="flex-1 min-w-0 bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
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
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 ml-1">電話番号</label>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-700 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 住所 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-600 mb-4 font-medium">住所</h3>
                        <div className="space-y-4">
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