import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
// 使わなくなったアイコン（Cigarette, Dog等）は整理し、Infoを追加
import { Check, MapPin, Calendar, Clock, Users, DollarSign, Loader2, Info } from 'lucide-react';

const CreateDrivePage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useStateはそのまま保持（バックエンドへの送信形式を維持するため）
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
        router.push('/driver/drives');
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <DriverHeader title="ドライブ作成" showBackButton={true} showNotification={false} showMyPage={false} />
        </div>

        <main className="flex-1 px-5 pt-6 pb-24 space-y-6">
          {/* ルート設定 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-tight">ルート情報</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">出発地 <span className="text-red-500 font-black ml-1">注意：自宅付近にしないでください</span></label>
                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-100 transition-all">
                  <MapPin className="w-4 h-4 text-slate-300 mr-3" />
                  <input type="text" placeholder="出発地を入力（例：高知駅）" className="bg-transparent w-full text-sm outline-none" value={formData.departure} onChange={e => setFormData({ ...formData, departure: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">目的地</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-100 transition-all">
                  <MapPin className="w-4 h-4 text-blue-500 mr-3" />
                  <input type="text" placeholder="目的地を入力（例：高知工科大学）" className="bg-transparent w-full text-sm outline-none" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
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
                  <input type="date" className="bg-transparent w-full text-sm outline-none" value={formData.departureDate} onChange={e => setFormData({ ...formData, departureDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">出発時刻</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-slate-300 mr-3" />
                  <input type="time" className="bg-transparent w-full text-sm outline-none" value={formData.departureTime} onChange={e => setFormData({ ...formData, departureTime: e.target.value })} />
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
                  <input type="number" className="bg-transparent w-full text-sm outline-none" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">料金 (円/人)</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3">
                  <DollarSign className="w-4 h-4 text-slate-300 mr-3" />
                  <input type="number" className="bg-transparent w-full text-sm outline-none" value={formData.fee} onChange={e => setFormData({ ...formData, fee: Number(e.target.value) })} />
                </div>
              </div>
            </div>
            <textarea
              className="w-full bg-slate-50 rounded-xl p-4 text-sm min-h-[100px] outline-none border border-transparent focus:border-slate-100"
              placeholder="ドライブの詳細や注意事項を記載してください"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* 車両ルール (表示の変更) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase">車両ルール</h2>
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                車両条件はプロフィールの値を使います
              </p>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:bg-slate-300"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 stroke-[3px]" />}
              ドライブを作成
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateDrivePage;