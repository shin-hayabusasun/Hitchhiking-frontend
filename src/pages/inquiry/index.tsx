// % Start(五藤暖葵、小松憲生)
// 問い合わせ画面: 運営への問い合わせフォームおよびFAQを表示する画面

import { useState } from 'react';
import { useRouter } from 'next/router';
import { TitleHeader } from '@/components/TitleHeader';
import { getApiUrl } from '@/config/api';
import { Send, AlertCircle, ChevronDown, HelpCircle, Mail, MessageSquare } from 'lucide-react';

export function InquiryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    email: '',
    subject: '',
    body: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validateForm() {
    if (!formData.category) {
      setError('問い合わせ種類を選択してください');
      return false;
    }
    if (!formData.email) {
      setError('メールアドレスを入力してください');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('正しいメールアドレス形式で入力してください');
      return false;
    }
    if (!formData.subject) {
      setError('件名を入力してください');
      return false;
    }
    if (!formData.body) {
      setError('本文を入力してください');
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    setError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      await fetch(getApiUrl('/api/inquiry'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      alert('お問い合わせを送信しました');
      router.push('/');
    } catch (err) {
      setError('送信に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full pt-8">
            <TitleHeader title="問い合わせフォーム" />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-6 pb-20">

            {/* お問い合わせフォームカード */}
            <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Inquiry Form</h2>
              </div>

              <div className="space-y-4">
                {/* 問い合わせ種類 */}
                <div>
                  <label htmlFor="category" className="block text-[11px] font-black text-gray-500 mb-1.5 ml-1">
                    お問い合わせ種類<span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 text-gray-900 text-xs font-bold rounded-xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer border border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="service">サービスについて</option>
                      <option value="account">アカウントについて</option>
                      <option value="payment">決済について</option>
                      <option value="drive">ドライブについて</option>
                      <option value="other">その他</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                  </div>
                </div>

                {/* メールアドレス */}
                <div>
                  <label htmlFor="email" className="block text-[11px] font-black text-gray-500 mb-1.5 ml-1">
                    メールアドレス<span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full bg-gray-50 text-gray-900 text-xs font-bold rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-gray-300 border border-transparent"
                    />
                  </div>
                </div>

                {/* 件名 */}
                <div>
                  <label htmlFor="subject" className="block text-[11px] font-black text-gray-500 mb-1.5 ml-1">
                    件名<span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="お問い合わせの件名を入力"
                    className="w-full bg-gray-50 text-gray-900 text-xs font-bold rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-gray-300 border border-transparent"
                  />
                </div>

                {/* お問い合わせ内容 */}
                <div>
                  <label htmlFor="body" className="block text-[11px] font-black text-gray-500 mb-1.5 ml-1">
                    お問い合わせ内容<span className="text-red-400 ml-1">*</span>
                  </label>
                  <textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={5}
                    placeholder="詳細をご記入ください"
                    className="w-full bg-gray-50 text-gray-900 text-xs font-bold rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-gray-300 resize-none border border-transparent"
                  ></textarea>
                </div>

                {/* エラーメッセージ */}
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-xl text-[11px] font-bold flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}

                {/* 送信ボタン */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <Send className="w-4 h-4 stroke-[2.5px]" />
                  {loading ? '送信中...' : '送信する'}
                </button>
                
                <p className="text-[10px] text-center text-gray-300 font-bold leading-relaxed">
                  3営業日以内にご登録のメールアドレス宛に回答いたします。
                </p>
              </div>
            </section>

            {/* よくある質問セクション */}
            <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 space-y-5">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">FAQ</h2>
              </div>

              <div className="space-y-4">
                {[
                  { q: '登録方法を教えてください', a: 'ログイン画面から「新規登録」ボタンを押して必要事項を入力してください。' },
                  { q: 'ポイントの有効期限はありますか？', a: 'ポイントの有効期限は獲得から1年間です。' },
                  { q: 'キャンセル方法を教えてください', a: 'マイドライブまたはマイリクエストからキャンセルできます。' }
                ].map((item, i) => (
                  <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <h3 className="font-black text-gray-800 text-[11px] mb-1.5 flex gap-2">
                      <span className="text-blue-500">Q.</span>
                      {item.q}
                    </h3>
                    <p className="text-gray-400 text-[10px] font-bold leading-relaxed pl-5 relative">
                      <span className="absolute left-0 text-gray-200">A.</span>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default InquiryPage;
// % End