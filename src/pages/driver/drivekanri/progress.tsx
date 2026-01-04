// src/pages/driver/drivekanri/progress.tsx
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import DriveStatusCard from "@/components/driver/DriveStatusCard";

export default function Progress() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ画面外枠 */}
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">

        {/* ヘッダー */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">ドライブ管理</h1>
        </div>

        {/* ステータスタブ */}
        <div className="mx-4 mt-4 bg-gray-200 rounded-full p-1 flex text-sm">
          <button
            onClick={() => router.push("/driver/drivekanri/schedule")}
            className="flex-1 py-2 text-center"
          >
            予定中
          </button>

          <div className="flex-1 bg-white rounded-full py-2 text-center font-semibold shadow">
            進行中
          </div>

          <button
            onClick={() => router.push("/driver/drivekanri/completion")}
            className="flex-1 py-2 text-center"
          >
            完了
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-4 space-y-4">
          <DriveStatusCard
            status="progress"
            from="渋谷駅"
            to="品川駅"
            datetime="2025-01-15 08:30"
            price={1200}
            driver={{
              name: "山田 太郎",
              rating: 4.8,
              driveCount: 45,
            }}
            onChat={() => router.push("/chat/1")}
            onComplete={() => alert("ドライブ完了")}
          />
        </div>

      </div>
    </div>
  );
}
