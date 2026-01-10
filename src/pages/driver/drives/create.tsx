import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check, MapPin, Calendar, Clock, Users, DollarSign, Loader2, Info } from 'lucide-react';

const CreateDrivePage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    capacity: 3,
    fee: 1000,
    message: '',
  });

  const handleCreate = async () => {
    if (!formData.departure || !formData.destination || !formData.departureDate || !formData.departureTime) {
      alert('すべての必須項目を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/driver/regist_drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.ok) {
        alert("ドライブを公開しました！");
        router.push('/driver/drives/management');
      } else {
        alert(result.detail || 'エラーが発生しました');
      }
    } catch (error) {
      alert('サーバーとの通信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10 font-sans text-slate-700">
      <header className="bg-white border-b border-slate-100 p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[#10B981]">ドライブを作成</h1>
        <div className="w-9" />
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* 地名入力セクション */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-tight">ルート情報</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">出発地（地名）</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-100 transition-all">
                <MapPin className="w-4 h-4 text-slate-300 mr-3" />
                <input type="text" placeholder="例：高知駅前" className="bg-transparent w-full text-sm outline-none" value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">目的地（地名）</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-100 transition-all">
                <MapPin className="w-4 h-4 text-blue-500 mr-3" />
                <input type="text" placeholder="例：高知工科大学" className="bg-transparent w-full text-sm outline-none" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* 日時設定 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase">日時</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">出発日</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3">
                <Calendar className="w-4 h-4 text-slate-300 mr-3" />
                <input type="date" className="bg-transparent w-full text-sm outline-none" value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">出発時刻</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3">
                <Clock className="w-4 h-4 text-slate-300 mr-3" />
                <input type="time" className="bg-transparent w-full text-sm outline-none" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* 詳細設定 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase">募集詳細</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">同乗可能人数</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3">
                <Users className="w-4 h-4 text-slate-300 mr-3" />
                <input type="number" className="bg-transparent w-full text-sm outline-none" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">料金 (円/人)</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3">
                <DollarSign className="w-4 h-4 text-slate-300 mr-3" />
                <input type="number" className="bg-transparent w-full text-sm outline-none" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} />
              </div>
            </div>
          </div>
          <textarea 
            className="w-full bg-slate-50 rounded-xl p-4 text-sm min-h-[100px] outline-none border border-transparent focus:border-slate-100" 
            placeholder="メッセージ（例：荷物が多い方は事前にお知らせください）"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>

        {/* 車両ルール案内 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase mb-3">車両ルール</h2>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-600 font-medium">プロフィール設定を適用します</p>
              <p className="text-[11px] text-slate-400 mt-1">
                禁煙設定やペット可否などは、マイページで設定された内容が自動的にこの募集に反映されます。
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCreate}
          disabled={isSubmitting}
          className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:bg-slate-300"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 stroke-[3px]" />}
          ドライブを作成
        </button>
      </div>
    </div>
  );
};

export default CreateDrivePage;