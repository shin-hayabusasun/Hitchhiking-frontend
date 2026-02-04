import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { getApiUrl } from '@/config/api';
import { Check, MapPin, Calendar, Clock, Users, DollarSign, Loader2, Info } from 'lucide-react';

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
      const response = await fetch(getApiUrl('/api/driver/regist_drive'), {
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* Header: 背景白・全幅 / 中身 max-w-2xl */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-2xl mx-auto w-full px-4 py-1">
            <DriverHeader 
              title="ドライブ作成" 
              showBackButton={true} 
              backPath="/driver/drives"
              showNotification={false} 
              showMyPage={false} 
            />
          </div>
        </header>

        {/* Main Content: max-w-2xl で中央寄せ */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 pt-8 pb-32">
          <div className="space-y-6">
            
            {/* ルート設定 */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-[#00B049] rounded-full"></div>
                ルート情報
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-gray-500 block mb-1.5 ml-1">
                    出発地 <span className="text-rose-500 ml-1">※自宅付近は避けてください</span>
                  </label>
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-transparent focus-within:border-[#00B049]/30 focus-within:bg-white transition-all">
                    <MapPin className="w-5 h-5 text-gray-300 mr-3" />
                    <input 
                      type="text" 
                      placeholder="例：高知駅" 
                      className="bg-transparent w-full text-sm font-bold outline-none" 
                      value={formData.departure} 
                      onChange={e => setFormData({ ...formData, departure: e.target.value })} 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-500 block mb-1.5 ml-1">目的地</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-transparent focus-within:border-[#00B049]/30 focus-within:bg-white transition-all">
                    <MapPin className="w-5 h-5 text-rose-400 mr-3" />
                    <input 
                      type="text" 
                      placeholder="例：高知工科大学" 
                      className="bg-transparent w-full text-sm font-bold outline-none" 
                      value={formData.destination} 
                      onChange={e => setFormData({ ...formData, destination: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 日時設定 */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-[#00B049] rounded-full"></div>
                日時
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-gray-500 block mb-1.5 ml-1">出発日</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-transparent focus-within:border-[#00B049]/30 focus-within:bg-white">
                    <Calendar className="w-4 h-4 text-gray-300 mr-3" />
                    <input type="date" className="bg-transparent w-full text-sm font-bold outline-none" value={formData.departureDate} onChange={e => setFormData({ ...formData, departureDate: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-500 block mb-1.5 ml-1">出発時刻</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-transparent focus-within:border-[#00B049]/30 focus-within:bg-white">
                    <Clock className="w-4 h-4 text-gray-300 mr-3" />
                    <input type="time" className="bg-transparent w-full text-sm font-bold outline-none" value={formData.departureTime} onChange={e => setFormData({ ...formData, departureTime: e.target.value })} />
                  </div>
                </div>
              </div>
            </section>

            {/* 詳細情報 */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-[#00B049] rounded-full"></div>
                詳細情報
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-gray-500 block mb-1.5 ml-1">同乗可能人数</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-transparent focus-within:border-[#00B049]/30 focus-within:bg-white">
                    <Users className="w-4 h-4 text-gray-300 mr-3" />
                    <input type="number" className="bg-transparent w-full text-sm font-bold outline-none" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-500 block mb-1.5 ml-1">料金 (円/人)</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-transparent focus-within:border-[#00B049]/30 focus-within:bg-white">
                    <DollarSign className="w-4 h-4 text-gray-300 mr-3" />
                    <input type="number" className="bg-transparent w-full text-sm font-bold outline-none" value={formData.fee} onChange={e => setFormData({ ...formData, fee: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
              <textarea
                className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold min-h-[120px] outline-none border border-transparent focus:border-[#00B049]/30 focus:bg-white transition-all"
                placeholder="ドライブの詳細や注意事項を記載してください"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </section>

            {/* 車両ルール */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 bg-[#00B049]/5 p-5 rounded-2xl border border-[#00B049]/10">
                <Info className="w-5 h-5 text-[#00B049] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-[#00B049] mb-1">車両ルールについて</h3>
                  <p className="text-xs text-gray-600 font-bold leading-relaxed">
                    喫煙・ペット等の条件は、あなたのプロフィールに登録されている設定が自動的に適用されます。
                  </p>
                </div>
              </div>
            </section>

            {/* 固定アクションエリア */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-5 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent z-40">
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="w-full bg-[#00B049] hover:bg-[#009940] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-200/50 transition-all active:scale-[0.98] disabled:bg-gray-300"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 stroke-[3px]" />}
                ドライブを公開する
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateDrivePage;