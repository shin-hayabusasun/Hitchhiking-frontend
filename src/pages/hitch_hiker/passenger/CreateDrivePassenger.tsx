import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, Clock, Users, Check, AlertCircle, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';

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
    if (!formData.departure || !formData.destination || !formData.departureDate || !formData.departureTime) {
      alert('必須項目を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/hitchhiker/regist_recruitment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '募集の作成に失敗しました');
      }

      const result = await response.json();

      if (result.ok) {
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full px-4 py-3 pt-8 flex items-center">
            <button onClick={() => router.back()} className="text-gray-400 hover:bg-gray-50 p-1.5 border border-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black text-blue-600 flex-1 text-center mr-8">同乗者募集を作成</h1>
          </div>
        </div>

        {/* フォームエリア */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-5 pb-32">
            
            <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed font-bold">
                入力された地点から経路を自動計算します。住所や駅名を入力してください。
              </p>
            </div>

            {/* ルート情報 */}
            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Route Information</h2>
              <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 ml-1">出発地</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-4 flex items-center text-base">📍</span>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300" 
                      placeholder="例: 高知駅" 
                      value={formData.departure} 
                      onChange={(e) => setFormData({...formData, departure: e.target.value})} 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 ml-1">目的地</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-4 flex items-center text-base">🚩</span>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300" 
                      placeholder="例: 高知工科大学" 
                      value={formData.destination} 
                      onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 希望日時 */}
            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Schedule</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-blue-500 mr-2" />
                  <input 
                    type="date" 
                    className="w-full bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0" 
                    value={formData.departureDate} 
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})} 
                  />
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <Clock className="w-3.5 h-3.5 text-blue-500 mr-2" />
                  <input 
                    type="time" 
                    className="w-full bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0" 
                    value={formData.departureTime} 
                    onChange={(e) => setFormData({...formData, departureTime: e.target.value})} 
                  />
                </div>
              </div>
            </section>

            {/* 詳細設定 */}
            <section className="space-y-3">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2">Preferences</h2>
              <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">希望人数</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-lg px-2">
                    <input 
                      type="number" 
                      className="w-12 bg-transparent border-none py-1.5 text-right font-black text-blue-600 text-sm focus:ring-0" 
                      value={formData.capacity} 
                      onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} 
                    />
                    <span className="text-[10px] font-bold text-gray-400 ml-1">名</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-400 ml-1">¥</span>
                    <span className="text-xs font-bold text-gray-600">希望予算</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-lg px-2">
                    <input 
                      type="number" 
                      className="w-20 bg-transparent border-none py-1.5 text-right font-black text-green-600 text-sm focus:ring-0" 
                      value={formData.fee} 
                      onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} 
                    />
                    <span className="text-[10px] font-bold text-gray-400 ml-1">円</span>
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-[10px] font-bold text-gray-500 ml-1">メッセージ</label>
                  <textarea 
                    className="w-full bg-gray-50 border-none rounded-xl mt-2 p-3 text-xs font-bold min-h-[80px] focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 leading-relaxed" 
                    placeholder="荷物の量や、待ち合わせの相談など" 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 固定ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto w-full p-5">
            <button 
              onClick={handleCreate} 
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 active:scale-95'} text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center shadow-lg shadow-blue-100 transition-all`}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2 stroke-[3px]" />
              )}
              {isSubmitting ? '送信中...' : '募集を公開する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDrivePassengerPage;