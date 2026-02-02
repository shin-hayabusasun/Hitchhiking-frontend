// src/pages/driver/drivekanri/progress.tsx
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import DriveStatusCard from "@/components/driver/DriveStatusCard";
import { getApiUrl } from "@/config/api";

// 型定義
interface OngoingDrive {
  id: string;
  application_id: number;
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

export default function Progress() {
  const router = useRouter();
  const [drives, setDrives] = useState<OngoingDrive[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl("/api/driver/progress"), {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDrives(data.drives);
    } catch (error) {
      console.error("進行中データの取得失敗:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleComplete = async (id: string) => {
    if (!confirm("このドライブを完了状態にしますか？")) return;

    try {
      const response = await fetch(getApiUrl("/api/driver/complete"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          driveId: parseInt(id, 10),
        }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        alert("ドライブを完了しました。お疲れ様でした！");
        await fetchProgress();
      } else {
        alert(result.message || "完了処理に失敗しました");
      }
    } catch (error) {
      console.error("完了処理エラー:", error);
      alert("通信エラーが発生しました");
    }
  };

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
      
      {/* ★ コンテンツを max-w-2xl に変更し、スマホ風の枠組みとデザインを維持 */}
      <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-200">
        
        {/* ヘッダー（元のデザイン、フォントサイズをそのまま維持） */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100 w-full">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">ドライブ管理</h1>
        </div>

        {/* ステータスタブ（元のデザインとボタンサイズをそのまま維持） */}
        <div className="w-full px-4 pt-4">
          <div className="bg-gray-200 rounded-full p-1 flex text-sm font-medium">
            <button
              onClick={() => router.push("/driver/drivekanri/schedule")}
              className="flex-1 py-2 text-center text-gray-500"
            >
              予定中
            </button>
            <div className="flex-1 bg-white rounded-full py-2 text-center font-bold shadow-sm text-blue-600">
              進行中
            </div>
            <button
              onClick={() => router.push("/driver/drivekanri/completion")}
              className="flex-1 py-2 text-center text-gray-500"
            >
              完了
            </button>
          </div>
          <p className="mt-2 text-gray-400 text-[10px] px-1">
            あなたの募集とあなたが承認した同乗者募集の両方あります
          </p>
        </div>

        {/* コンテンツエリア（Cardのデザイン等は一切変更なし） */}
        <main className="w-full p-4 space-y-4 flex-grow">
          {drives.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">
                現在進行中のドライブは
                <br />
                ありません
              </p>
            </div>
          ) : (
            drives.map((drive) => (
              <DriveStatusCard
                key={drive.id}
                status="progress"
                from={drive.from_loc}
                to={drive.to_loc}
                datetime={drive.datetime}
                price={drive.price}
                driver={drive.driver}
                onChat={() => router.push(`/chat/${drive.application_id}`)}
                onComplete={() => handleComplete(drive.id)}
              />
            ))
          )}
        </main>

        <div className="h-10" />
      </div>
    </div>
  );
}