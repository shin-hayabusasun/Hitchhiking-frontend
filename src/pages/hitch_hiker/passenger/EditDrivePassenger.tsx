// % Start(AI Assistant)
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
    // router.queryが空の状態（ページ読み込み直後）を回避
    if (!router.isReady || !id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        // 詳細API：/api/hitchhiker/recruitment_detail?recruitment_id=xx
        const response = await fetch(getApiUrl(`/api/hitchhiker/recruitment_detail?recruitment_id=${id}`), {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('詳細データの取得に失敗しました');

        const result = await response.json();
        
        if (result.ok && result.data) {
          const detail = result.data;
          
          // APIから返ってくる日時（2025-12-25 09:00形式など）をフォーム用に分割
          const [datePart, timePart] = detail.dep_time.split(' ');

          setFormData({
            departure: detail.departure_name || detail.dep_latitude, // 地名カラムがある想定、なければ座標
            destination: detail.destination_name || detail.arr_latitude,
            date: datePart, // YYYY-MM-DD
            time: timePart.substring(0, 5), // HH:mm
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
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-gray-500 font-bold">情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F8FAFC] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 overflow-hidden rounded-[3rem]">
        
        {/* ヘッダー */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 pt-10 sticky top-0 z-10">
          <button onClick={() => router.back()} className="text-gray-500 p-2"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-black text-gray-800">募集内容の編集</h1>
          <button onClick={handleDelete} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28 scrollbar-hide">
          {/* ルート設定 */}
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="font-black text-gray-700">ルート・日時の変更</h2>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-green-500" />
                <input 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-500" 
                  value={formData.departure}
                  onChange={(e) => setFormData({...formData, departure: e.target.value})}
                  placeholder="出発地を入力"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-red-500" />
                <input 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-500" 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  placeholder="目的地を入力"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-9 text-[11px] font-bold focus:ring-2 focus:ring-blue-500" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="flex-1 relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="time" 
                  className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-9 text-[11px] font-bold focus:ring-2 focus:ring-blue-500" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* 条件設定 */}
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 ml-1 uppercase tracking-wider">人数・予算の変更</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 ml-1 font-bold italic">PASSENGERS</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 text-center font-black text-blue-600 focus:ring-2 focus:ring-blue-500" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 ml-1 font-bold italic">BUDGET (¥)</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 text-center font-black text-green-600 focus:ring-2 focus:ring-green-500" 
                  value={formData.fee}
                  onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 保存アクション */}
        <div className="absolute bottom-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-gray-50">
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:bg-gray-400"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {isSubmitting ? '保存中...' : '変更を保存する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDrivePassengerPage;