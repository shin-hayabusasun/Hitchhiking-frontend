// % Start(稗田隼也)
// 新規登録画面: ファイル名保持機能を追加した完全版UI

import { useState } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '@/config/api';

export function RegistPage() {
    const router = useRouter();
    
    // フォーム全体のステート管理（ロジック維持）
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
        sex: '',
        year: '',
        month: '',
        day: '',
        postalCode: '',
        prefecture: '',
        city: '',
        address: '',
        isDriver: 0,
        identification: '', // 画像のBase64データ
        fileName: '',       // 選択されたファイルの名前
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 入力バリデーション（ロジック維持）
    function validateForm() {
        if (!formData.email || !formData.password || !formData.lastName || !formData.firstName) {
            setError('必須項目をすべて入力してください');
            return false;
        }
        if (formData.password.length < 8) {
            setError('パスワードは8文字以上で入力してください');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません');
            return false;
        }
        if (formData.isDriver === 1 && !formData.identification) {
            setError('運転者登録には本人確認書類が必要です');
            return false;
        }
        return true;
    }

    // 登録ボタン押下時の処理（ロジック維持）
    async function handleRegister() {
        setError('');
        if (!validateForm()) return;
        setLoading(true);

        try {
            const requestData = {
                mail: formData.email,
                password: formData.password,
                name: [formData.lastName, formData.firstName],
                sex: formData.sex === '男性' ? 1 : 0,
                barthday: [Number(formData.year), Number(formData.month), Number(formData.day)],
                adress: [formData.postalCode, formData.prefecture, formData.city, formData.address],
                identification: formData.identification,
                isdriver: formData.isDriver,
            };

            const response = await fetch(getApiUrl('/api/user/regist'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok && data.ok) {
                router.push('/login/Complete');
            } else {
                setError('登録に失敗しました。内容を確認してください。');
            }
        } catch (err) {
            setError('サーバーとの通信に失敗しました。');
        } finally {
            setLoading(false);
        }
    }

    // ファイルアップロード処理（ロジック維持）
    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ 
                    ...formData, 
                    identification: reader.result as string, 
                    fileName: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        /* 背景色を全体に広げ、中央寄せにする */
        <div className="min-h-screen bg-gradient-to-b from-sky-200 to-white flex items-start justify-center p-4 font-sans text-gray-800">
            
            {/* ★ サイズ変更：スマホ枠を外し、max-w-2xlに拡張。全体のスクロールを許容 */}
            <div className="w-full max-w-2xl flex flex-col relative py-8">
                
                {/* ヘッダーセクション */}
                <div className="flex items-center px-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 active:scale-90 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="ml-4 text-blue-600 font-black text-xl">新規会員登録</h1>
                </div>

                {/* メインカード：幅を十分に確保 */}
                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-6">
                    <h2 className="text-xl font-black text-gray-800 mb-1">会員情報入力</h2>
                    <p className="text-gray-400 text-xs mb-8 font-bold">すべての項目を入力してください</p>

                    <div className="space-y-8">
                        
                        {/* 氏名入力 */}
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1">氏名</label>
                            <div className="flex gap-4">
                                <input type="text" placeholder="姓" className="w-1/2 px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none border-transparent focus:bg-white transition-all"
                                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                <input type="text" placeholder="名" className="w-1/2 px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none border-transparent focus:bg-white transition-all"
                                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                            </div>
                        </div>

                        {/* 性別 */}
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1">性別</label>
                            <select className="w-full px-4 py-4 bg-gray-50 rounded-xl text-gray-500 focus:ring-2 focus:ring-blue-500/20 outline-none border-transparent focus:bg-white transition-all appearance-none"
                                value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})}>
                                <option value="">選択してください</option>
                                <option value="男性">男性</option>
                                <option value="女性">女性</option>
                            </select>
                        </div>

                        {/* 生年月日 */}
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1">生年月日</label>
                            <div className="flex gap-3 text-sm">
                                <input type="number" placeholder="年" className="w-1/3 px-3 py-4 bg-gray-50 rounded-xl text-center focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                                <input type="number" placeholder="月" className="w-1/3 px-3 py-4 bg-gray-50 rounded-xl text-center focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                                <input type="number" placeholder="日" className="w-1/3 px-3 py-4 bg-gray-50 rounded-xl text-center focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} />
                            </div>
                        </div>

                        {/* 住所入力 */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="block text-sm font-black text-gray-700 ml-1">住所</label>
                            <input type="text" placeholder="郵便番号" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                            <input type="text" placeholder="都道府県" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.prefecture} onChange={e => setFormData({...formData, prefecture: e.target.value})} />
                            <input type="text" placeholder="市区町村" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                            <input type="text" placeholder="番地・建物名" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>

                        {/* アカウント設定 */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 ml-1">メールアドレス</label>
                                <input type="email" placeholder="example@email.com" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 ml-1">パスワード</label>
                                <input type="password" placeholder="8文字以上" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 ml-1">パスワード（確認）</label>
                                <input type="password" placeholder="パスワードを再入力" className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                            </div>
                        </div>

                        {/* 本人確認書類 */}
                        <div className="pt-4">
                            <label className="block text-sm font-black text-gray-700 ml-1">本人確認書類 <span className="text-red-500">*必須</span></label>
                            <p className="text-xs text-gray-400 mb-4 font-bold">運転免許証、マイナンバーカードなど</p>
                            <label className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                </svg>
                                <span className="text-sm text-gray-400 text-center break-all px-4 font-bold">
                                    {formData.fileName ? `選択中: ${formData.fileName}` : "ファイルをアップロード"}
                                </span>
                            </label>
                        </div>

                        {/* 運転者フラグ */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            <input type="checkbox" className="w-6 h-6 border-gray-200 rounded text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                                checked={formData.isDriver === 1} onChange={e => setFormData({...formData, isDriver: e.target.checked ? 1 : 0})} />
                            <span className="text-sm font-black text-gray-700">運転者として登録する</span>
                        </div>

                        {/* エラー表示 */}
                        {error && (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <p className="text-red-500 text-xs text-center font-black leading-tight">{error}</p>
                            </div>
                        )}

                        {/* 登録実行ボタン */}
                        <button onClick={handleRegister} disabled={loading} className={`w-full text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] ${
                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}>
                            {loading ? '処理中...' : '登録する'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistPage;

// % End