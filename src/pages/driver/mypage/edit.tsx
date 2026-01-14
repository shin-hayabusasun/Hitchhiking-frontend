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

export default function DriverEditPage() {
  const router = useRouter();

  /* ===== state ===== */
  const [name, setName] = useState(''); // 表示用。編集はさせない
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
        const res = await fetch('http://localhost:8000/api/driver/mypage', {
          credentials: 'include', // 認証情報を含める
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
      const res = await fetch('http://localhost:8000/api/driver/mypage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 保存時にも認証情報を含める
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-white shadow-2xl border-[8px] border-white rounded-3xl overflow-y-auto">

        {/* ヘッダー */}
        <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
            <span className="font-bold">プロフィール編集</span>
          </div>
          <button onClick={() => router.back()} className="text-sm text-gray-500">
            キャンセル
          </button>
        </header>

        <main className="p-4 space-y-4 pb-10">

          {/* プロフィール基本情報（氏名固定） */}
          <section className="bg-white rounded-2xl p-6 shadow-sm text-center border">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600">
                {name.charAt(0) || 'K'}
              </div>
              <button className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full border-2 border-white">
                <Camera size={16} className="text-white" />
              </button>
            </div>

            <div className="text-left space-y-1">
              <label className="text-xs text-gray-400 ml-1">氏名（変更できません）</label>
              <div className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-bold text-gray-600">
                {name}
              </div>
            </div>
          </section>

          {/* 車両情報 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
            <h3 className="font-bold text-gray-500 text-sm">車両情報</h3>
            <input
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm"
              placeholder="車種"
            />
            <div className="flex gap-3">
              <input
                value={carColor}
                onChange={(e) => setCarColor(e.target.value)}
                className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-sm"
                placeholder="色"
              />
              <input
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-sm"
                placeholder="年式"
              />
            </div>
            <input
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              className="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm"
              placeholder="ナンバープレート"
            />
          </section>

          {/* 車両ルール */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
            <h3 className="font-bold text-gray-500 text-sm">車両ルール</h3>
            {[
              { key: 'smoke', label: '禁煙', icon: <XCircle className="text-red-500" /> },
              { key: 'pet', label: 'ペット可', icon: <PawPrint className="text-orange-500" /> },
              { key: 'food', label: '飲食OK', icon: <AlertTriangle className="text-yellow-500" /> },
              { key: 'music', label: '音楽OK', icon: <Music className="text-purple-500" /> },
            ].map((r) => (
              <div key={r.key} className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-sm">
                  {r.icon}
                  {r.label}
                </div>
                <button
                  onClick={() =>
                    setRules({ ...rules, [r.key]: !rules[r.key as keyof typeof rules] })
                  }
                  className={`w-11 h-6 rounded-full px-1 flex items-center transition-colors ${
                    rules[r.key as keyof typeof rules] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      rules[r.key as keyof typeof rules] ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </section>

          {/* 自己紹介 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-bold text-gray-500 text-sm mb-2">自己紹介</h3>
            <textarea
              rows={5}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              className="w-full bg-gray-50 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="自己紹介を書いてみましょう"
            />
          </section>

          {/* 保存ボタン */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              保存する
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}