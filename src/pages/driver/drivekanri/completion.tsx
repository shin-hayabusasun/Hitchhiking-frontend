import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import DriveStatusCard from "@/components/driver/DriveStatusCard";
import { getApiUrl } from "@/config/api";

// 型定義
interface CompletedDrive {
  id: string;
  from_loc: string;
  to_loc: string;
  datetime: string;
  price: number;
  driver: {
    name: string;
    rating: number;
    driveCount: number;
  };
}

export default function DriveCompletionPage() {
  const router = useRouter();
  const [drives, setDrives] = useState<CompletedDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const response = await fetch(getApiUrl("/api/driver/completion"), {
          credentials: "include", // セッション情報を送信
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDrives(data.drives);
      } catch (error) {
        console.error("完了データの取得失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    /* ★ 背景を w-full で画面一杯に広げ、中央寄せを適用 */
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      
      {/* ★ コンテンツを max-w-2xl に変更し、スマホ風の枠組みを維持 */}
      <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-200">
        
        {/* ヘッダー（元のデザインとボタンサイズをそのまま維持） */}
        <header className="sticky top-0 bg-white z-10 border-b px-4 py-3 flex items-center gap-3 w-full">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft />
          </button>
          <h1 className="font-bold">ドライブ管理</h1>
        </header>

        {/* タブ（元のデザイン、フォントサイズ、色を維持） */}
        <div className="w-full px-4 py-3 bg-white">
          <div className="flex bg-gray-200 rounded-full text-sm p-1 font-medium">
            <button
              onClick={() => router.push("/driver/drivekanri/schedule")}
              className="flex-1 py-2 text-gray-500"
            >
              予定中
            </button>
            <button
              onClick={() => router.push("/driver/drivekanri/progress")}
              className="flex-1 py-2 text-gray-500"
            >
              進行中
            </button>
            <button className="flex-1 py-2 bg-white rounded-full font-bold shadow-sm text-blue-600">
              完了
            </button>
          </div>
        </div>

        {/* 完了ドライブ一覧（DriveStatusCard の中身も変更なし） */}
        <main className="w-full p-4 space-y-4 flex-grow">
          {drives.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">
                完了したドライブは
                <br />
                ありません
              </p>
            </div>
          ) : (
            drives.map((drive) => (
              <DriveStatusCard
                key={drive.id}
                status="completion"
                from={drive.from_loc}
                to={drive.to_loc}
                datetime={drive.datetime}
                price={drive.price}
                driver={drive.driver}
                onReview={() =>
                  router.push(
                    `/driver/drivekanri/review?recruitmentId=${drive.id}`
                  )
                }
              />
            ))
          )}
        </main>

        <div className="h-10" />
      </div>
    </div>
  );
}