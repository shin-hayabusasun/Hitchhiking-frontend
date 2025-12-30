// src/pages/driver/mypage/edit.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Save } from 'lucide-react';

export default function DriverEditPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [hobby, setHobby] = useState('');
  const [purpose, setPurpose] = useState('');
  const [rules, setRules] = useState({
    smoke: true,
    pet: false,
    food: true,
    music: true,
  });

  /** 初期値読み込み */
  useEffect(() => {
    const saved = localStorage.getItem('driverProfile');
    if (saved) {
      const p = JSON.parse(saved);
      setName(p.name);
      setIntroduction(p.introduction);
      setHobby(p.hobby);
      setPurpose(p.purpose);
      setRules(p.rules);
    }
  }, []);

  /** 保存 */
  const handleSave = () => {
    localStorage.setItem(
      'driverProfile',
      JSON.stringify({
        name,
        introduction,
        hobby,
        purpose,
        rules,
      })
    );
    router.push('/driver/mypage');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft onClick={() => router.back()} />
            <h1 className="font-bold">マイページ</h1>
          </div>
          <button onClick={() => router.back()} className="text-sm">
            キャンセル
          </button>
        </div>

        {/* 氏名 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <label className="font-bold text-sm">氏名</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-gray-100 px-3 py-2"
          />
        </section>

        {/* 車両ルール */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">車両ルール</h3>
          {[
            ['禁煙', 'smoke'],
            ['ペット可', 'pet'],
            ['飲食OK', 'food'],
            ['音楽OK', 'music'],
          ].map(([label, key]) => (
            <div key={key} className="flex justify-between items-center">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={rules[key as keyof typeof rules]}
                onChange={(e) =>
                  setRules({ ...rules, [key]: e.target.checked })
                }
              />
            </div>
          ))}
        </section>

        {/* 自己紹介 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <label className="font-bold text-sm">自己紹介</label>
          <textarea
            rows={4}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="w-full rounded-lg bg-gray-100 px-3 py-2"
          />
        </section>

        {/* 趣味 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <label className="font-bold text-sm">趣味</label>
          <input
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
            className="w-full rounded-lg bg-gray-100 px-3 py-2"
          />
        </section>

        {/* 利用目的 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <label className="font-bold text-sm">主な利用目的</label>
          <input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full rounded-lg bg-gray-100 px-3 py-2"
          />
        </section>

        <button
          onClick={handleSave}
          className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white flex justify-center items-center gap-2"
        >
          <Save size={18} /> 保存する
        </button>
      </div>
    </div>
  );
}