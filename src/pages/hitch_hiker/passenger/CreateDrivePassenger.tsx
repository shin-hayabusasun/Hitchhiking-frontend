// % Start(AI Assistant)
//DBはメッセージがない
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, Clock, Users, Check, AlertCircle, Loader2 } from 'lucide-react';

// 型定義
interface FormData {
  departure: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  capacity: number;
  fee: number;
  message: string;
}

const CreateDrivePassengerPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    departure: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    capacity: 1,
    fee: 1000,
    message: '',
  });

  // APIリクエスト処理
  const handleCreate = async (): Promise<void> => {
    // 簡易バリデーション
    if (!formData.departure || !formData.destination || !formData.departureDate || !formData.departureTime) {
      alert('必須項目を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      // FastAPIのバックエンドを叩く
      const response = await fetch('http://localhost:8000/api/hitchhiker/regist_recruitment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // クッキー（セッションID）を送信
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '募集の作成に失敗しました');
      }

      const result = await response.json();

      if (result.ok) {
        
        // 募集管理画面（または詳細画面）へ遷移
        router.push('/hitch_hiker/RecruitmentManagement');
      }
    } catch (error: any) {
      console.error('Submit Error:', error);
      alert(error.message || '通信エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F8FAFC] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 overflow-hidden rounded-[3rem]">
        
        {/* ヘッダー */}
        <div className="bg-white p-4 flex items-center border-b border-gray-100 pt-10 sticky top-0 z-10">
          <button onClick={() => router.back()} className="text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[17px] font-black text-blue-600 flex-1 text-center mr-8">同乗者募集を作成</h1>
        </div>

        {/* フォームエリア */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 scrollbar-hide">
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
              入力された地点から経路を自動計算します。住所や駅名を入力してください。
            </p>
          </div>

          {/* ルート情報 */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">ルート情報</h2>
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-50 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-500 ml-1">出発地</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-4 flex items-center text-lg">📍</span>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500" 
                    placeholder="例: 高知駅" 
                    value={formData.departure} 
                    onChange={(e) => setFormData({...formData, departure: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500 ml-1">目的地</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-4 flex items-center text-lg">🚩</span>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500" 
                    placeholder="例: 高知工科大学" 
                    value={formData.destination} 
                    onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 希望日時 */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">希望日時</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 relative flex items-center">
                <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                <input 
                  type="date" 
                  className="w-full bg-transparent border-none p-0 text-xs font-bold focus:ring-0" 
                  value={formData.departureDate} 
                  onChange={(e) => setFormData({...formData, departureDate: e.target.value})} 
                />
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 relative flex items-center">
                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                <input 
                  type="time" 
                  className="w-full bg-transparent border-none p-0 text-xs font-bold focus:ring-0" 
                  value={formData.departureTime} 
                  onChange={(e) => setFormData({...formData, departureTime: e.target.value})} 
                />
              </div>
            </div>
          </section>

          {/* 詳細設定 */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">詳細設定</h2>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-600">希望人数</span>
                </div>
                <input 
                  type="number" 
                  className="w-20 bg-gray-50 border-none rounded-xl py-2 px-3 text-right font-black text-blue-600" 
                  value={formData.capacity} 
                  onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-400">¥</span>
                  <span className="text-sm font-bold text-gray-600">希望予算</span>
                </div>
                <input 
                  type="number" 
                  className="w-24 bg-gray-50 border-none rounded-xl py-2 px-3 text-right font-black text-green-600" 
                  value={formData.fee} 
                  onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} 
                />
              </div>
              <div className="pt-2">
                <label className="text-[11px] font-bold text-gray-500 ml-1">メッセージ</label>
                <textarea 
                  className="w-full bg-gray-50 border-none rounded-2xl mt-2 p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500" 
                  placeholder="荷物の量や、待ち合わせの相談など" 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                />
              </div>
            </div>
          </section>
        </div>

        {/* 固定アクションボタン */}
        <div className="absolute bottom-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-gray-50 z-20">
          <button 
            onClick={handleCreate} 
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Check className="w-5 h-5 mr-2 stroke-[3px]" />
            )}
            {isSubmitting ? '送信中...' : '募集を公開する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDrivePassengerPage;
// % End