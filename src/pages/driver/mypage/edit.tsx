import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Camera,
  Music,
  PawPrint,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { getApiUrl } from '@/config/api';

export default function DriverEditPage() {
  const router = useRouter();

  /* ===== state ===== */
  const [name, setName] = useState(''); 
  const [introduction, setIntroduction] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carNumber, setCarNumber] = useState('');

  const [rules, setRules] = useState({
    smoke: true,
    pet: false,
    food: true,
    music: true,
  });

  /* ===== 初期値読み込み（APIから取得） ===== */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(getApiUrl('/api/driver/mypage'), {
          credentials: 'include',
        });
        if (res.ok) {
          const p = await res.json();
          setName(p.name ?? '');
          setIntroduction(p.introduction ?? '');
          setCarModel(p.car.model ?? '');
          setCarColor(p.car.color ?? '');
          setCarYear(p.car.year?.toString() ?? '');
          setCarNumber(p.car.number ?? '');
          setRules({
            smoke: p.rules.smoking,
            pet: p.rules.pet,
            food: p.rules.food,
            music: p.rules.music,
          });
        }
      } catch (e) {
        console.error("データの取得に失敗しました");
      }
    };
    fetchInitialData();
  }, []);

  /* ===== 保存処理 ===== */
  const handleSave = async () => {
    const payload = {
      name,
      introduction,
      carModel,
      carColor,
      carYear,
      carNumber,
      rules,
    };

    try {
      const res = await fetch(getApiUrl('/api/driver/mypage'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/driver/mypage');
      } else {
        alert("保存に失敗しました");
      }
    } catch (e) {
      alert("通信エラーが発生しました");
    }
  };

  return (
    /* ★ 背景を w-full で全幅に広げ、中央寄せを適用 */
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
      
      {/* ★ コンテンツを max-w-2xl に制限。既存のシャドウと背景色を維持 */}
      <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-100">
        
        {/* ヘッダー (そのまま維持) */}
        <header className="w-full sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="cursor-pointer text-slate-600" onClick={() => router.back()} />
            <span className="font-extrabold text-slate-800">プロフィール編集</span>
          </div>
          <button onClick={() => router.back()} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
            キャンセル
          </button>
        </header>

        <main className="w-full flex-1 p-5 space-y-5 pb-20">

          {/* プロフィール基本情報（氏名固定） */}
          <section className="w-full bg-white rounded-3xl p-8 shadow-sm text-center border border-slate-50">
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center text-4xl font-black text-[#10B981] shadow-inner">
                {name.charAt(0) || 'K'}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#10B981] p-2.5 rounded-full border-4 border-white shadow-md transition-transform active:scale-90">
                <Camera size={18} className="text-white" />
              </button>
            </div>

            <div className="text-left space-y-2">
              <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">氏名（変更できません）</label>
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600">
                {name}
              </div>
            </div>
          </section>

          {/* 車両情報 */}
          <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50 space-y-4">
            <h3 className="font-black text-slate-400 text-xs uppercase tracking-wider ml-1">車両情報</h3>
            <div className="space-y-3">
              <input
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="w-full bg-slate-50 border border-transparent focus:border-emerald-100 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                placeholder="車種"
              />
              <div className="flex gap-3 w-full">
                <input
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  className="flex-1 bg-slate-50 border border-transparent focus:border-emerald-100 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                  placeholder="色"
                />
                <input
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  className="flex-1 bg-slate-50 border border-transparent focus:border-emerald-100 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                  placeholder="年式"
                />
              </div>
              <input
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                className="w-full bg-slate-50 border border-transparent focus:border-emerald-100 rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                placeholder="ナンバープレート"
              />
            </div>
          </section>

          {/* 車両ルール */}
          <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50 space-y-5">
            <h3 className="font-black text-slate-400 text-xs uppercase tracking-wider ml-1">車両ルール</h3>
            <div className="space-y-4">
              {[
                { key: 'smoke', label: '禁煙', icon: <XCircle className="text-red-500" /> },
                { key: 'pet', label: 'ペット可', icon: <PawPrint className="text-orange-500" /> },
                { key: 'food', label: '飲食OK', icon: <AlertTriangle className="text-yellow-500" /> },
                { key: 'music', label: '音楽OK', icon: <Music className="text-purple-500" /> },
              ].map((r) => (
                <div key={r.key} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <span className="p-2 bg-white rounded-xl shadow-sm">{r.icon}</span>
                    {r.label}
                  </div>
                  <button
                    onClick={() =>
                      setRules({ ...rules, [r.key]: !rules[r.key as keyof typeof rules] })
                    }
                    className={`w-12 h-7 rounded-full px-1 flex items-center transition-all duration-300 ${
                      rules[r.key as keyof typeof rules] ? 'bg-[#10B981]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        rules[r.key as keyof typeof rules] ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 自己紹介 */}
          <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
            <h3 className="font-black text-slate-400 text-xs uppercase tracking-wider mb-3 ml-1">自己紹介</h3>
            <textarea
              rows={5}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              className="w-full bg-slate-50 border border-transparent focus:border-emerald-100 rounded-2xl px-4 py-3 text-sm outline-none transition-all resize-none"
              placeholder="自己紹介を書いてみましょう"
            />
          </section>

          {/* 保存ボタン */}
          <div className="pt-4 w-full">
            <button
              onClick={handleSave}
              className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
            >
              保存する
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}