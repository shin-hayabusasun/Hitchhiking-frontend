// ver5
// 決済情報画面（サイズ維持・デザイン復元）
// サイズ・構造は「完璧」と言っていただいた直前のものを維持し、デザインのみを復元しました。

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// --- 型定義 ---
interface Card {
  id: string;
  brand: 'VISA' | 'Mastercard' | 'JCB' | 'Amex' | 'Diners' | 'Unknown';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export function PaymentSettingsPage() {
  const router = useRouter();

  // --- State管理 ---
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    name: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    isDefault: false,
  });

  // --- 初期データ取得 ---
  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      const dummyCards: Card[] = [
        {
          id: 'card_1',
          brand: 'VISA',
          last4: '4242',
          expMonth: 12,
          expYear: 2027,
          isDefault: true,
        },
      ];
      setTimeout(() => {
        setCards(dummyCards);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('カード情報の取得に失敗しました');
      setLoading(false);
    }
  }

  const handleBack = () => router.back();

  const handleAddCard = async () => {
    setError('');
    if (!newCard.cardNumber || !newCard.name || !newCard.expMonth || !newCard.expYear || !newCard.cvv) {
      setError('すべての項目を入力してください');
      return;
    }
    try {
      alert('この機能は実装予定です');
      setNewCard({ cardNumber: '', name: '', expMonth: '', expYear: '', cvv: '', isDefault: false });
      fetchCards();
    } catch (err) {
      setError('カードの追加に失敗しました');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('削除しますか？')) return;
    alert(`この機能は実装予定です`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-400">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* サイズ構造: 
        外枠 w-full で背景色を敷き、
        内部の container を max-w-2xl mx-auto で中央寄せにする「完璧だったサイズ」を維持。
      */}
      <div className="w-full min-h-screen flex flex-col relative bg-gradient-to-b from-sky-200 to-white">
        
        {/* --- ヘッダー（サイズ規約準拠） --- */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-2xl mx-auto w-full px-4 h-16 flex items-center">
            <button onClick={handleBack} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="ml-2 text-lg font-bold text-gray-800">決済情報</h1>
          </div>
        </div>

        {/* --- メインコンテンツ（サイズ規約準拠） --- */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full p-4 sm:p-8 space-y-8 pb-32">
            
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl border border-red-100 font-bold">
                {error}
              </div>
            )}

            {/* --- 登録済みカードリスト --- */}
            <section>
              <h2 className="text-sm font-bold text-gray-600 mb-4 ml-1 uppercase tracking-wider">登録済みクレジットカード</h2>
              
              <div className="space-y-4">
                {cards.map((card) => (
                  <div key={card.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      {/* ブランドアイコン（ver2デザイン） */}
                      <div className={`w-12 h-8 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm
                        ${card.brand === 'VISA' ? 'bg-blue-600' : 
                          card.brand === 'Mastercard' ? 'bg-orange-500' : 'bg-gray-500'}`}>
                        {card.brand === 'VISA' && <span className="italic font-serif">VISA</span>}
                        {card.brand === 'Mastercard' && (
                          <div className="flex -space-x-1">
                            <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                          {card.brand} •••• {card.last4}
                          {card.isDefault && (
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              メイン
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          有効期限 {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteCard(card.id)} 
                      className="text-sm text-gray-400 font-bold hover:text-gray-600 px-3 py-1"
                    >
                      編集
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* --- カード追加フォーム（ver2の赤枠デザインを復元） --- */}
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10">
              <h2 className="text-xl font-bold text-gray-800 mb-8">新しいカードを追加</h2>

              <div className="space-y-6">
                {/* カード番号 */}
                <div className="relative border border-red-500 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-gray-400">
                    カード番号
                  </div>
                  <input
                    type="text"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none focus:bg-white h-14 font-bold transition-colors"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  />
                </div>

                {/* カード名義人 */}
                <div className="relative border border-red-500 rounded-xl focus-within:border-blue-500 transition-all">
                  <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-gray-400">
                    カード名義人
                  </div>
                  <input
                    type="text"
                    autoComplete="cc-name"
                    placeholder="TARO YAMADA"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none focus:bg-white h-14 font-bold transition-colors"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 有効期限 */}
                  <div className="relative border border-red-500 rounded-xl focus-within:border-blue-500 transition-all">
                    <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-gray-400">
                      有効期限
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-xl h-14 px-4">
                      <input
                        type="text"
                        autoComplete="cc-exp-month"
                        placeholder="MM"
                        maxLength={2}
                        className="w-full bg-transparent border-none p-0 text-center focus:outline-none placeholder-gray-300 font-bold"
                        value={newCard.expMonth}
                        onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                      />
                      <span className="text-gray-300 mx-1">/</span>
                      <input
                        type="text"
                        autoComplete="cc-exp-year"
                        placeholder="YY"
                        maxLength={2}
                        className="w-full bg-transparent border-none p-0 text-center focus:outline-none placeholder-gray-300 font-bold"
                        value={newCard.expYear}
                        onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* セキュリティコード */}
                  <div className="relative border border-red-500 rounded-xl focus-within:border-blue-500 transition-all">
                    <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-gray-400">
                      セキュリティコード
                    </div>
                    <input
                      type="password"
                      autoComplete="cc-csc"
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none focus:bg-white h-14 font-bold text-center tracking-widest transition-colors"
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    />
                  </div>
                </div>

                {/* メインカード設定 */}
                <label className="flex items-center space-x-3 cursor-pointer group px-1">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                    checked={newCard.isDefault}
                    onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                  />
                  <span className="text-sm font-bold text-gray-500 group-hover:text-gray-800 transition-colors">このカードをメインカードに設定</span>
                </label>

                {/* 登録ボタン（ver2デザイン） */}
                <button
                  onClick={handleAddCard}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-full shadow-lg shadow-blue-100 active:scale-[0.98] transition-all mt-4 text-sm tracking-widest uppercase"
                >
                  カードを追加
                </button>
              </div>
            </section>

            {/* 安全表記（ver2デザイン） */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 flex items-start space-x-4 border border-blue-100 shadow-sm">
              <div className="text-blue-500 mt-1 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-xs text-blue-900 leading-relaxed font-medium">
                <p className="font-black text-sm mb-1 uppercase tracking-tight">セキュアな決済保護</p>
                <p className="opacity-70">カード情報は暗号化され、安全に保護されます。当サービスではカード情報を保存せず、決済代行会社を通じて安全に処理されます。</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default PaymentSettingsPage;