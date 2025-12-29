// % Start(AI Assistant)
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Trash2, Save, Calendar, Clock, MapPin } from 'lucide-react';

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
  // 初期値（実際はAPIから取得）
  const [formData, setFormData] = useState<EditFormData>({
    departure: '高知駅',
    destination: '高知工科大学',
    date: '2025-12-25',
    time: '09:00',
    capacity: 2,
    fee: 1200,
    message: '大きな荷物があります。',
  });

  const handleSave = (): void => {
    alert('変更を保存しました');
    router.back();
  };

  const handleDelete = (): void => {
    if (confirm('この募集を削除してもよろしいですか？')) {
      alert('削除しました');
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F8FAFC] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 overflow-hidden rounded-[3rem]">
        
        {/* ヘッダー：削除ボタン付き */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 pt-10 sticky top-0 z-10">
          <button onClick={() => router.back()} className="text-gray-500 p-2"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-black text-gray-800">募集内容の編集</h1>
          <button onClick={handleDelete} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28 scrollbar-hide">
          {/* 現在の状態表示カード */}
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="font-black text-gray-700">ルート・日時の変更</h2>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-green-500" />
                <input 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 text-sm font-bold" 
                  value={formData.departure}
                  onChange={(e) => setFormData({...formData, departure: e.target.value})}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-red-500" />
                <input 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 text-sm font-bold" 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-9 text-[11px] font-bold" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="flex-1 relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="time" 
                  className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-9 text-[11px] font-bold" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* 条件設定カード */}
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 ml-1 uppercase">人数・予算の変更</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 ml-1 font-bold italic">PASSENGERS</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 text-center font-black text-blue-600" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 ml-1 font-bold italic">BUDGET (¥)</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 text-center font-black text-green-600" 
                  value={formData.fee}
                  onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 下部固定ボタン */}
        <div className="absolute bottom-0 w-full p-6 bg-white border-t border-gray-50">
          <button 
            onClick={handleSave} 
            className="w-full bg-gray-900 text-white py-4 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <Save className="w-5 h-5 mr-2" /> 変更を保存する
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDrivePassengerPage;
// % End