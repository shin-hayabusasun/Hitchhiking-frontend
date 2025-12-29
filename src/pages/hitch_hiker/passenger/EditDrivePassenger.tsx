// % Start(AI Assistant)
// 同乗者募集編集画面: 画像のUIデザインを再現
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Trash2, Calendar, Clock, Users, DollarSign, Check } from 'lucide-react';

export default function EditDrivePassengerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    departure: '東京都',
    destination: '横浜駅',
    departureDate: '2025-11-10',
    departureTime: '10:00',
    capacity: 2,
    fee: 1500,
    message: '',
  });

  const handleSave = () => {
    alert('変更を保存しました');
    router.back();
  };

  const handleDelete = () => {
    if (confirm('この募集を削除してもよろしいですか？')) {
      alert('募集を削除しました');
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      {/* スマホ外枠 */}
      <div className="w-full max-w-[390px] aspect-[9/19] bg-[#F8FAFC] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 overflow-hidden rounded-[3rem]">
        
        {/* ヘッダー */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 pt-10">
          <button onClick={() => router.back()} className="text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-blue-600">募集を編集</h1>
          <button onClick={handleDelete} className="text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* フォームエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
          {/* インフォメーション */}
          <div className="bg-[#EFF6FF] p-4 rounded-2xl border border-blue-100">
            <p className="text-sm text-blue-700 leading-relaxed">
              募集内容を編集します。変更内容は運転者に通知されます。
            </p>
          </div>

          {/* ルート情報 */}
          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-500 mb-2">ルート情報</h2>
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">出発地 * <span className="text-red-400 font-normal">注意：出発地を自宅付近にしないでください</span></label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg">📍</span>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm" value={formData.departure} onChange={(e) => setFormData({...formData, departure: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">目的地 *</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-blue-500 text-lg">📍</span>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
              </div>
            </div>
          </section>

          {/* 希望日時 */}
          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-500 mb-2">希望日時</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">希望日 *</label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-2 text-sm" value={formData.departureDate} onChange={(e) => setFormData({...formData, departureDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">希望時刻 *</label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input type="time" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-2 text-sm" value={formData.departureTime} onChange={(e) => setFormData({...formData, departureTime: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

          {/* 詳細情報 */}
          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-500 mb-2">詳細情報</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">同乗希望人数 *</label>
                <div className="relative mt-1">
                  <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">予算 (円/人) *</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-3 text-gray-400 text-lg">$</span>
                  <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700" value={formData.fee} onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">メッセージ</label>
              <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl mt-1 p-4 text-sm min-h-[100px]" placeholder="運転者へのメッセージや希望条件を記載" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
            </div>
          </section>

          {/* 注意事項 */}
          <div className="bg-[#FFFBEB] p-4 rounded-2xl border border-yellow-100">
            <h3 className="text-xs font-bold text-yellow-800 mb-1">ご注意</h3>
            <ul className="text-[10px] text-yellow-700 space-y-1 list-disc pl-4 leading-tight">
              <li>変更内容は運転者に通知されます</li>
              <li>既に申請がある場合、申請者にも変更が通知されます</li>
            </ul>
          </div>
        </div>

        {/* 保存ボタン固定エリア */}
        <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full text-center">
          <button onClick={handleSave} className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg active:scale-[0.98] transition-all">
            <Check className="w-5 h-5 mr-2" /> 変更を保存
          </button>
          <p className="text-[10px] text-gray-400 mt-2">※変更通知が関連する運転者に送信されます</p>
        </div>
      </div>
    </div>
  );
}
// % End