// % Start 黒星
// src/pages/driver/mypage/index.tsx

import React from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Pencil,
  CheckCircle,
  Car,
  Star,
  Settings,
  XCircle,
  PawPrint,
  AlertTriangle,
  Music,
  FileText,
} from 'lucide-react';

export default function DriverProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>
        <h1 className="font-bold">マイページ</h1>
        <button
          onClick={() => router.push('/driver/mypage/edit')}
          className="text-blue-600 flex items-center gap-1 text-sm"
        >
          <Pencil size={16} /> 編集
        </button>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        {/* プロフィール概要 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-green-600">
            山
          </div>
          <h2 className="text-xl font-bold">山田 太郎</h2>

          <div className="flex justify-center gap-2 my-3">
            <span className="flex items-center text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
              <CheckCircle size={14} className="mr-1" />
              本人確認済み
            </span>
            <span className="flex items-center text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
              <Car size={14} className="mr-1" />
              免許証確認済み
            </span>
          </div>

          <div className="flex justify-around border-t pt-4 mt-4 text-sm">
            <div>
              <p className="font-bold text-lg">45</p>
              <p className="text-gray-500">ドライブ回数</p>
            </div>
            <div>
              <p className="font-bold text-lg flex items-center justify-center">
                <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                4.8
              </p>
              <p className="text-gray-500">評価</p>
            </div>
            <div>
              <p className="font-bold">2024-01~</p>
              <p className="text-gray-500">登録日</p>
            </div>
          </div>

          <div className="mt-4">
          <button
            onClick={() => router.push('/driver/drivekanri/schedule')}
            className="w-full flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="text-green-600" />
              ドライブ管理
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        </section>

        {/* 車両情報 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2 text-sm">
          <h3 className="font-bold text-gray-500 text-sm mb-2">車両情報</h3>
          <p>車種：トヨタ プリウス</p>
          <p>色：白</p>
          <p>年式：2022年</p>
          <p>ナンバー：品川 123 あ4567</p>
        </section>

        {/* 車両ルール */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-500 text-sm">車両ルール</h3>

          {[
            { label: '禁煙', icon: <XCircle className="text-red-500" />, on: true },
            { label: 'ペット可', icon: <PawPrint className="text-orange-500" />, on: false },
            { label: '飲食OK', icon: <AlertTriangle className="text-yellow-500" />, on: true },
            { label: '音楽OK', icon: <Music className="text-purple-500" />, on: true },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm font-medium">
                {item.icon}
                {item.label}
              </div>
              <div
                className={`w-11 h-6 rounded-full flex items-center px-1 ${
                  item.on ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition ${
                    item.on ? 'translate-x-5' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </section>

        {/* 自己紹介 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-500 text-sm mb-2">自己紹介</h3>
          <p className="text-sm">
            安全運転を心がけています。快適なドライブを提供します！
          </p>
        </section>

        {/* 趣味 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-500 text-sm mb-2">趣味</h3>
          <p className="text-sm">ドライブ、音楽、カラオケ</p>
        </section>

        {/* 主な利用目的 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-500 text-sm mb-2">主な利用目的</h3>
          <p className="text-sm">通勤ついでに同乗者募集</p>
        </section>

        {/* 運転免許証 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-500 text-sm">運転免許証</h3>
            <span className="text-blue-600 text-xs flex items-center">
              <CheckCircle size={14} className="mr-1" />
              確認済み
            </span>
          </div>
          <p className="text-sm">免許証番号：第123456789012号</p>
          <p className="text-sm">有効期限：2028-12-31</p>
        </section>

        {/* 設定 */}
        <section className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Settings />
            設定
          </div>
          <span className="text-gray-400">›</span>
        </section>
      </main>
    </div>
  );
}