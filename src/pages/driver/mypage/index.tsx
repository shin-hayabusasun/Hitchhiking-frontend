// % Start 黒星
// components/driver/ProfilePage.tsx
import React from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  User,
  Car,
  CheckCircle,
  Star,
  Settings,
  AlertTriangle,
  Dog,
  XCircle,
} from 'lucide-react';

// ダミーデータ
const userProfile = {
  name: '山田 太郎',
  isVerifiedUser: true,
  isVerifiedLicense: true,
  driveCount: 45,
  rating: 4.8,
  registrationDate: '2024-01~',
  vehicle: {
    makeModel: 'トヨタ プリウス',
    color: '白',
    licensePlate: '品川 123 あ4567',
    year: '2022年',
  },
  rules: {
    noSmoking: true,
    petsAllowed: true,
    foodAllowed: true,
    musicAllowed: true,
  },
  introduction: '安全運転を心がけています。快適なドライブを提供します！',
  hobbies: 'ドライブ、音楽、カラオケ',
  purpose: '通勤ついでに同乗者募集',
  license: {
    number: '第123456789012号',
    expiry: '2028-12-31',
    verified: true,
  },
};

// ヘッダー
const Header = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="font-semibold">{title}</h1>
        <button className="text-blue-600 text-sm">編集</button>
      </div>
    </header>
  );
};

export default function DriverProfilePage() {
  const user = userProfile;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="マイページ" />

      <main className="p-4 space-y-4">
        {/* プロフィール概要 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-green-600">山</span>
            </div>

            <h2 className="text-xl font-bold">{user.name}</h2>

            <div className="flex gap-2 my-3">
              <span className="flex items-center text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 mr-1" />
                本人確認済み
              </span>
              <span className="flex items-center text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                <Car className="w-4 h-4 mr-1" />
                免許証確認済み
              </span>
            </div>

            <div className="flex w-full justify-around border-y py-4">
              <div className="text-center">
                <p className="text-xl font-bold">{user.driveCount}</p>
                <p className="text-xs text-gray-500">ドライブ回数</p>
              </div>
              <div className="text-center">
                <p className="flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  {user.rating}
                </p>
                <p className="text-xs text-gray-500">評価</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.registrationDate}</p>
                <p className="text-xs text-gray-500">登録日</p>
              </div>
            </div>
          </div>
        </div>

        {/* 車両情報 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-3">車両情報</h3>
          <p>車種：{user.vehicle.makeModel}</p>
          <p>色：{user.vehicle.color}</p>
          <p>年式：{user.vehicle.year}</p>
          <p>ナンバー：{user.vehicle.licensePlate}</p>
        </div>

        {/* 車両ルール */}
        <div className="bg-white rounded-lg p-6 shadow space-y-4">
          <h3 className="font-semibold">車両ルール</h3>

          {[
            { label: '禁煙', icon: <XCircle className="text-red-500" />, value: user.rules.noSmoking },
            { label: 'ペット可', icon: <Dog className="text-orange-500" />, value: user.rules.petsAllowed },
            { label: '飲食OK', icon: <AlertTriangle className="text-yellow-500" />, value: user.rules.foodAllowed },
            { label: '音楽OK', icon: <User className="text-purple-500" />, value: user.rules.musicAllowed },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </div>
              <div className={`w-10 h-5 rounded-full ${item.value ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>

        {/* 自己紹介 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-2">自己紹介</h3>
          <p>{user.introduction}</p>
        </div>

        {/* 趣味 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-2">趣味</h3>
          <p>{user.hobbies}</p>
        </div>

        {/* 利用目的 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-2">主な利用目的</h3>
          <p>{user.purpose}</p>
        </div>

        {/* 運転免許証 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">運転免許証</h3>
            {user.license.verified && (
              <span className="text-blue-600 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                確認済み
              </span>
            )}
          </div>
          <p>免許証番号：{user.license.number}</p>
          <p>有効期限：{user.license.expiry}</p>
        </div>

        {/* 設定 */}
        <div className="bg-white rounded-lg p-4 shadow flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings />
            設定
          </div>
          <ArrowLeft className="rotate-180 w-4 h-4 text-gray-400" />
        </div>
      </main>
    </div>
  );
}
