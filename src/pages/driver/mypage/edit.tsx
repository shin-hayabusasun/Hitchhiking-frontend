import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Music,
  PawPrint,
  AlertTriangle,
  XCircle,
  Settings,
} from 'lucide-react';

export default function DriverEditPage() {
  const router = useRouter();

  /* ===== state ===== */
  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [hobby, setHobby] = useState('');
  const [purpose, setPurpose] = useState('');

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

  /* ===== 初期値読み込み ===== */
  useEffect(() => {
    const saved = localStorage.getItem('driverProfile');
    if (saved) {
      const p = JSON.parse(saved);
      setName(p.name ?? '山田 太郎');
      setIntroduction(p.introduction ?? '');
      setHobby(p.hobby ?? '');
      setPurpose(p.purpose ?? '');
      setCarModel(p.carModel ?? 'トヨタ プリウス');
      setCarColor(p.carColor ?? '白');
      setCarYear(p.carYear ?? '2022');
      setCarNumber(p.carNumber ?? '品川 123 あ4567');
      setRules(p.rules ?? rules);
    }
  }, []);

  /* ===== 保存 ===== */
  const handleSave = () => {
    localStorage.setItem(
      'driverProfile',
      JSON.stringify({
        name,
        introduction,
        hobby,
        purpose,
        carModel,
        carColor,
        carYear,
        carNumber,
        rules,
      })
    );
    router.push('/driver/mypage');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* 📱 スマホ外枠 */}
      <div className="w-full max-w-[390px] aspect-[9/19] bg-white shadow-2xl border-[8px] border-white rounded-3xl overflow-y-auto">

        {/* ヘッダー */}
        <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
            <span className="font-bold">マイページ</span>
          </div>
          <button onClick={() => router.back()} className="text-sm">
            キャンセル
          </button>
        </header>

        <main className="p-4 space-y-4">

          {/* プロフィール */}
          <section className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600">
                {name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full">
                <Camera size={16} className="text-white" />
              </button>
            </div>

            <label className="text-sm text-gray-500 block mb-1">氏名</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 rounded-lg py-2 text-sm text-center"
            />

            <div className="flex justify-around mt-4 text-sm">
              <div>
                <p className="font-bold">45</p>
                <p className="text-gray-500">ドライブ回数</p>
              </div>
              <div>
                <p className="font-bold text-yellow-500">★ 4.8</p>
                <p className="text-gray-500">評価</p>
              </div>
              <div>
                <p className="font-bold">2024-01~</p>
                <p className="text-gray-500">登録日</p>
              </div>
            </div>
          </section>

          {/* 車両情報 */}
          <section className="bg-white rounded-2xl p-6 shadow-sm text-sm space-y-3">
            <h3 className="font-bold text-gray-500">車両情報</h3>

            <input
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-3 py-2"
              placeholder="車種"
            />

            <div className="flex gap-3">
              <input
                value={carColor}
                onChange={(e) => setCarColor(e.target.value)}
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2"
                placeholder="色"
              />
              <input
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2"
                placeholder="年式"
              />
            </div>

            <input
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-3 py-2"
              placeholder="ナンバープレート"
            />
          </section>

          {/* 車両ルール */}
          <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
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
                  className={`w-11 h-6 rounded-full px-1 flex items-center ${
                    rules[r.key as keyof typeof rules] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition ${
                      rules[r.key as keyof typeof rules] ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </section>

          {/* 自己紹介・趣味・目的 */}
          {[
            ['自己紹介', introduction, setIntroduction],
            ['趣味', hobby, setHobby],
            ['主な利用目的', purpose, setPurpose],
          ].map(([label, value, setter]: any) => (
            <section key={label} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-500 text-sm mb-2">{label}</h3>
              <textarea
                rows={label === '自己紹介' ? 4 : 1}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm"
              />
            </section>
          ))}

          {/* 設定 */}
          <section className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Settings size={16} />
              設定
            </div>
            <span className="text-gray-400">›</span>
          </section>

          {/* 保存 */}
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl"
          >
            保存
          </button>
        </main>
      </div>
    </div>
  );
}
