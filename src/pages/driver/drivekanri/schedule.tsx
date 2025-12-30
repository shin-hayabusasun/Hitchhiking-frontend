// src/pages/driver/drivekanri/schedule.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';

type Drive = {
  id: number;
  date: string;
  from: string;
  to: string;
  passengers: number;
};

const scheduledDrives: Drive[] = [
  {
    id: 1,
    date: '2025-01-10 08:30',
    from: '渋谷駅',
    to: '品川駅',
    passengers: 2,
  },
  {
    id: 2,
    date: '2025-01-12 18:00',
    from: '新宿駅',
    to: '横浜駅',
    passengers: 1,
  },
];

export default function DriveSchedulePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>
        <h1 className="font-bold">ドライブ管理</h1>
      </header>

      {/* タブ */}
      <div className="bg-white px-4 pt-3">
        <div className="flex text-sm font-medium">
          <button
            className="flex-1 pb-2 border-b-2 border-blue-600 text-blue-600"
          >
            予定中
          </button>

          <button
            onClick={() => router.push('/driver/drivekanri/progress')}
            className="flex-1 pb-2 border-b-2 border-transparent text-gray-400"
          >
            進行中
          </button>

          <button
            onClick={() => router.push('/driver/drivekanri/completion')}
            className="flex-1 pb-2 border-b-2 border-transparent text-gray-400"
          >
            完了
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <main className="p-4 space-y-4 max-w-md mx-auto">
        {scheduledDrives.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            予定中のドライブはありません
          </p>
        ) : (
          scheduledDrives.map((drive) => (
            <div
              key={drive.id}
              className="bg-white rounded-2xl p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-bold">
                <Calendar size={16} />
                {drive.date}
              </div>

              <div className="text-sm text-gray-700 flex items-center gap-2">
                <MapPin size={16} />
                {drive.from} → {drive.to}
              </div>

              <div className="text-sm text-gray-700 flex items-center gap-2">
                <Users size={16} />
                同乗者 {drive.passengers} 人
              </div>

              <button
                onClick={() =>
                  router.push(`/driver/drivekanri/detail/${drive.id}`)
                }
                className="mt-3 w-full rounded-xl border py-2 text-sm font-medium"
              >
                詳細を見る
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
