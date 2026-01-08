// % Start(AI Assistant)
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Check, MapPin, Calendar, Clock, Users, DollarSign, Cigarette, Dog, Utensils, Music, Loader2 } from 'lucide-react';

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
    noSmoking: true,
    petAllowed: false,
    foodAllowed: true,
    musicAllowed: true,
  });

  const handleCreate = async () => {
    if (!formData.departureDate || !formData.departureTime) {
      alert('出発日時を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/driver/regist_drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          vehiclerules: {
            noSmoking: formData.noSmoking,
            petAllowed: formData.petAllowed,
            foodAllowed: formData.foodAllowed,
            musicAllowed: formData.musicAllowed,
          }
        }),
      });

      const result = await response.json();
      if (response.ok && result.ok) {
        alert("ドライブを公開しました！");
        router.push('/driver/drives/management'); // 成功後の遷移先
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
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[#10B981]">ドライブを作成</h1>
        <div className="w-9" />
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* ルート設定 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-tight">ルート情報</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">出発地 <span className="text-red-500 font-black ml-1">注意：自宅付近にしないでください</span></label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-100 transition-all">
                <MapPin className="w-4 h-4 text-slate-300 mr-3" />
                <input type="text" placeholder="出発地を入力（例：高知駅）" className="bg-transparent w-full text-sm outline-none" value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">目的地</label>
              <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-100 transition-all">
                <MapPin className="w-4 h-4 text-blue-500 mr-3" />
                <input type="text" placeholder="目的地を入力（例：高知工科大学）" className="bg-transparent w-full text-sm outline-none" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
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

        {/* 金額・定員 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase">詳細情報</h2>
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
            placeholder="ドライブの詳細や注意事項を記載してください"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>

        {/* 車内ルール (黒いトグルスイッチ) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase">車両ルール</h2>
          <div className="divide-y divide-slate-50">
            <ToggleRow icon={<Cigarette className="w-4 h-4" />} label="禁煙" desc="車内での喫煙を禁止" active={formData.noSmoking} onClick={() => setFormData({...formData, noSmoking: !formData.noSmoking})} />
            <ToggleRow icon={<Dog className="w-4 h-4" />} label="ペット可" desc="ペット同乗を許可" active={formData.petAllowed} onClick={() => setFormData({...formData, petAllowed: !formData.petAllowed})} />
            <ToggleRow icon={<Utensils className="w-4 h-4" />} label="飲食OK" desc="車内での飲食を許可" active={formData.foodAllowed} onClick={() => setFormData({...formData, foodAllowed: !formData.foodAllowed})} />
            <ToggleRow icon={<Music className="w-4 h-4" />} label="音楽OK" desc="音楽再生を許可" active={formData.musicAllowed} onClick={() => setFormData({...formData, musicAllowed: !formData.musicAllowed})} />
          </div>
        </div>

        {/* 送信ボタン */}
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

// トグルスイッチ用コンポーネント
const ToggleRow = ({ icon, label, desc, active, onClick }: any) => (
  <div className="flex items-center py-4">
    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 mr-4">{icon}</div>
    <div className="flex-1">
      <div className="text-sm font-bold text-slate-700">{label}</div>
      <div className="text-[11px] text-slate-400">{desc}</div>
    </div>
    <button onClick={onClick} className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-black' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default CreateDrivePage;
// % End