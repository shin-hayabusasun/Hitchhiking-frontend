// ver2
// 決済情報画面（クレカ登録・確認・削除）
// 画像のUIデザイン（上下配置、常時フォーム表示）に合わせて作成

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// --- 型定義 ---
interface Card {
  id: string;
  brand: 'VISA' | 'Mastercard' | 'JCB' | 'Amex' | 'Diners' | 'Unknown';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean; // メインカードかどうか
}

export function PaymentSettingsPage() {
  const router = useRouter();

  // --- State管理 ---
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 新規カード入力用State
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    name: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    isDefault: false, // 「このカードをメインカードに設定」チェックボックス用
  });

  // --- 初期データ取得 ---
  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      // 本番APIへのリクエスト（コメントアウトを外せば動作するように記述）
      /*
      const response = await fetch('/api/payment/cards', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setCards(data.cards);
      */

      // ★ダミーデータ生成関数（ご要望により追加）
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
      // 擬似的なローディング遅延を入れてリアルに見せる
      setTimeout(() => {
        setCards(dummyCards);
        setLoading(false);
      }, 500);

    } catch (err) {
      console.error(err);
      setError('カード情報の取得に失敗しました');
      setLoading(false);
    }
  }

  // --- イベントハンドラ ---
  
  // 戻るボタン
  const handleBack = () => router.back();

  // カード追加
  const handleAddCard = async () => {
    setError('');
    
    // 簡易バリデーション
    if (!newCard.cardNumber || !newCard.name || !newCard.expMonth || !newCard.expYear || !newCard.cvv) {
      setError('すべての項目を入力してください');
      return;
    }

    try {
      // TODO: ここでAPI通信 (POST /api/payment/cards)
      alert('この機能は実装予定です');
      
      // フォームリセット
      setNewCard({
        cardNumber: '',
        name: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        isDefault: false,
      });
      
      // 一覧再取得
      fetchCards();

    } catch (err) {
      setError('カードの追加に失敗しました');
    }
  };

  // カード削除
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('削除しますか？')) return;
    // API通信処理...
    alert(`この機能は実装予定です`);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
      {/* --- ① ヘッダー --- */}
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-200 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="ml-2 text-lg font-bold text-gray-800">決済情報</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded">{error}</div>}

        {/* --- 登録済みクレジットカード --- */}
        <section>
          <h2 className="text-sm font-bold text-gray-600 mb-3 ml-1">登録済みクレジットカード</h2>
          
          <div className="space-y-3">
            {cards.map((card) => (
              <div key={card.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                  {/* カードアイコン */}
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
                  
                  {/* カード情報テキスト */}
                  <div>
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      {card.brand} •••• {card.last4}
                      {card.isDefault && (
                        <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          メイン
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      有効期限 {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                    </div>
                  </div>
                </div>

                {/* 編集ボタン */}
                <button 
                  onClick={() => handleDeleteCard(card.id)} 
                  className="text-sm text-gray-400 font-medium hover:text-gray-600 px-2 py-1"
                >
                  編集
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- 新しいカードを追加フォーム --- */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">新しいカードを追加</h2>

          <div className="space-y-4">
            {/* ② カード番号 */}
            <div className="relative border border-red-500 rounded-lg group focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
                カード番号
              </div>
              <input
                type="text"
                name="cardNumber"
                autoComplete="cc-number" // ★追加
                placeholder="1234 5678 9012 3456"
                className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:bg-white transition-colors h-12"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
              />
            </div>

            {/* ③ カード名義人 */}
            <div className="relative border border-red-500 rounded-lg focus-within:border-blue-500">
               <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
                カード名義人
              </div>
              <input
                type="text"
                name="cardName"
                autoComplete="cc-name" // ★追加
                placeholder="TARO YAMADA"
                className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white h-12"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* ④ 有効期限 */}
              <div className="relative border border-red-500 rounded-lg focus-within:border-blue-500">
                 <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
                  有効期限
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg h-12 px-4">
                   <input
                    type="text"
                    name="expMonth"
                    autoComplete="cc-exp-month" // ★追加: 月と明示
                    placeholder="MM"
                    maxLength={2}
                    className="w-10 bg-transparent border-none p-0 text-center focus:outline-none placeholder-gray-400"
                    value={newCard.expMonth}
                    onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                  />
                  <span className="text-gray-400 mx-1">/</span>
                  <input
                    type="text"
                    name="expYear"
                    autoComplete="cc-exp-year" // ★追加: 年と明示
                    placeholder="YY"
                    maxLength={2}
                    className="w-10 bg-transparent border-none p-0 text-center focus:outline-none placeholder-gray-400"
                    value={newCard.expYear}
                    onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                  />
                </div>
              </div>

              {/* ⑤ セキュリティコード */}
              <div className="relative border border-red-500 rounded-lg focus-within:border-blue-500">
                 <div className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
                  セキュリティコード
                </div>
                <input
                  type="password"
                  name="cvc"
                  autoComplete="cc-csc" // ★追加: セキュリティコードと明示
                  placeholder="123"
                  maxLength={4}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white h-12"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                />
              </div>
            </div>

            {/* メインカード設定チェックボックス */}
            <label className="flex items-center space-x-2 cursor-pointer mt-2">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                checked={newCard.isDefault}
                onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
              />
              <span className="text-sm text-gray-600">このカードをメインカードに設定</span>
            </label>

            {/* ⑥ 追加ボタン */}
            <button
              onClick={handleAddCard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-md transition-colors mt-4"
            >
              カードを追加
            </button>
          </div>
        </section>

        {/* フッター安全表記エリア */}
        <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3 mt-8">
          <div className="text-blue-600 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="text-xs text-blue-800 leading-relaxed">
            <p className="font-bold mb-1">安全な決済</p>
            <p>カード情報は暗号化され、安全に保護されます。当サービスではカード情報を保存せず、決済代行会社を通じて安全に処理されます。</p>
          </div>
        </div>

      </main>
    </div>
  </div>
  );
}

export default PaymentSettingsPage;