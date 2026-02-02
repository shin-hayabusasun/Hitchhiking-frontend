import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Trash2, Save, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface EditFormData {
  departure: string;
  destination: string;
  date: string;
  time: string;
  capacity: number;
  fee: number;
  message: string;
}

const EditDrivePassengerPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    departure: '',
    destination: '',
    date: '',
    time: '',
    capacity: 1,
    fee: 0,
    message: '',
  });

  // --- 1. 詳細取得APIの呼び出し ---
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl(`/api/hitchhiker/recruitment_detail?recruitment_id=${id}`), {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('詳細データの取得に失敗しました');

        const result = await response.json();
        
        if (result.ok && result.data) {
          const detail = result.data;
          const [datePart, timePart] = detail.dep_time.split(' ');

          setFormData({
            departure: detail.departure_name || detail.dep_latitude,
            destination: detail.destination_name || detail.arr_latitude,
            date: datePart,
            time: timePart.substring(0, 5),
            capacity: detail.capacity,
            fee: detail.fare,
            message: detail.message || '',
          });
        }
      } catch (error) {
        console.error("Fetch detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, router.isReady]);

  // --- 2. 更新処理 ---
  const handleSave = async (): Promise<void> => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/hitchhiker/update_recruitment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recruitment_id: Number(id),
          departure: formData.departure,
          destination: formData.destination,
          departureDate: formData.date,
          departureTime: formData.time,
          capacity: formData.capacity,
          fee: formData.fee,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.ok) {
        alert('変更を保存しました');
        router.back();
      } else {
        alert(result.detail || '保存に失敗しました');
      }
    } catch (error) {
      console.error("Save error:", error);
      alert('通信エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. 削除処理
  const handleDelete = async (): Promise<void> => {
    if (confirm('この募集を削除してもよろしいですか？')) {
      alert('削除機能はバックエンドの実装待ちです');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#F8FAFC]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <div className="text-[12px] text-gray-400 font-bold">情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full px-4 py-3 pt-8 flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-400 p-1.5 hover:bg-gray-50 border border-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black text-gray-800">募集内容の編集</h1>
            <button onClick={handleDelete} className="text-red-400 p-1.5 hover:bg-red-50 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-5 pb-32">
            
            {/* ルート設定 */}
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                <h2 className="text-xs font-black text-gray-700">Route & Schedule</h2>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 w-3.5 h-3.5 text-green-500" />
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 text-xs font-bold focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300" 
                    value={formData.departure}
                    onChange={(e) => setFormData({...formData, departure: e.target.value})}
                    placeholder="出発地を入力"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 w-3.5 h-3.5 text-red-500" />
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 text-xs font-bold focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300" 
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    placeholder="目的地を入力"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border-none rounded-lg py-2 pl-8 text-[10px] font-bold focus:ring-2 focus:ring-blue-500" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="flex-1 relative">
                  <Clock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="time" 
                    className="w-full bg-gray-50 border-none rounded-lg py-2 pl-8 text-[10px] font-bold focus:ring-2 focus:ring-blue-500" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 条件設定 */}
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider">Passengers & Budget</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-transparent focus-within:border-blue-100 transition-all">
                  <label className="block text-[9px] text-gray-400 font-bold italic mb-1">CAPACITY</label>
                  <div className="flex items-center justify-center space-x-1">
                    <input 
                      type="number" 
                      className="w-full bg-transparent border-none p-0 text-center font-black text-blue-600 text-sm focus:ring-0" 
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                    />
                    <span className="text-[10px] font-bold text-gray-400">名</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-transparent focus-within:border-green-100 transition-all">
                  <label className="block text-[9px] text-gray-400 font-bold italic mb-1">BUDGET (¥)</label>
                  <div className="flex items-center justify-center space-x-1">
                    <input 
                      type="number" 
                      className="w-full bg-transparent border-none p-0 text-center font-black text-green-600 text-sm focus:ring-0" 
                      value={formData.fee}
                      onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})}
                    />
                    <span className="text-[10px] font-bold text-gray-400">円</span>
                  </div>
                </div>
              </div>
              <div className="pt-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">Message</label>
                <textarea 
                  className="w-full bg-gray-50 border-none rounded-xl mt-1.5 p-3 text-xs font-bold min-h-[80px] focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 leading-relaxed" 
                  placeholder="追加情報があれば入力してください" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto w-full p-5">
            <button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? '保存中...' : '変更を保存する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDrivePassengerPage;