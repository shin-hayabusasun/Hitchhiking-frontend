// src/pages/driver/drivekanri/completion.tsx

import React from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import DriveStatusCard from "@/components/driver/DriveStatusCard";

type CompletedDrive = {
  id: number;
  from: string;
  to: string;
  datetime: string;
  price: number;
  driver: {
    name: string;
    rating: number;
    driveCount: number;
  };
};

const completedDrives: CompletedDrive[] = [
  {
    id: 1,
    from: "新宿駅",
    to: "成田空港",
    datetime: "2025-11-05 10:00",
    price: 3000,
    driver: {
      name: "田中 次郎",
      rating: 4.7,
      driveCount: 32,
    },
  },
  {
    id: 2,
    from: "東京駅",
    to: "軽井沢",
    datetime: "2025-10-28 07:00",
    price: 7000,
    driver: {
      name: "中村 健太",
      rating: 4.8,
      driveCount: 58,
    },
  },
];

export default function DriveCompletionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ外枠 */}
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">

        {/* ヘッダー */}
        <header className="sticky top-0 bg-white z-10 border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="font-bold">ドライブ管理</h1>
        </header>

        {/* タブ */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex bg-gray-200 rounded-full text-sm">
            <button
              onClick={() => router.push("/driver/drivekanri/schedule")}
              className="flex-1 py-2 text-gray-400"
            >
              予定中
            </button>
            <button
              onClick={() => router.push("/driver/drivekanri/progress")}
              className="flex-1 py-2 text-gray-400"
            >
              進行中
            </button>
            <button className="flex-1 py-2 bg-white rounded-full font-bold">
              完了
            </button>
          </div>
        </div>

        {/* 完了ドライブ一覧 */}
        <main className="p-4 space-y-4">
          {completedDrives.map((drive) => (
            <DriveStatusCard
              key={drive.id}
              status="completion"
              from={drive.from}
              to={drive.to}
              datetime={drive.datetime}
              price={drive.price}
              driver={drive.driver}
              onReview={() =>
                router.push(`/driver/drivekanri/review?driveId=${drive.id}`)
              }
            />
          ))}
        </main>
      </div>
    </div>
  );
}
