// src/pages/driver/drivekanri/progress.tsx
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import DriveStatusCard from "@/components/driver/DriveStatusCard";

// 型定義
interface OngoingDrive {
  id: string;
  application_id: number; // 申請ID（取引ID）
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

  // --- データ取得処理を関数として独立させる ---
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://54.165.126.189:8000/api/driver/progress", {
        credentials: "include", // セッション情報を送信
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

  // --- ドライブ完了 API の呼び出し ---
  const handleComplete = async (id: string) => {
    if (!confirm("このドライブを完了状態にしますか？")) return;

    try {
      const response = await fetch("http://54.165.126.189:8000/api/driver/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          driveId: parseInt(id, 10), // APIの型に合わせて数値に変換
        }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        alert("ドライブを完了しました。お疲れ様でした！");
        // リストを再取得して、完了した項目を画面から消す
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-gray-800">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto rounded-[2rem]">
        
        {/* ヘッダー */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">ドライブ管理</h1>
        </div>

        {/* ステータスタブ */}
        <div className="mx-4 mt-4 bg-gray-200 rounded-full p-1 flex text-sm font-medium">
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
        <p className="px-5 mt-2 text-gray-400 text-[10px]">あなたの募集とあなたが承認した同乗者募集の両方あります</p>

        {/* コンテンツ */}
        <div className="p-4 space-y-4">
          {drives.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">現在進行中のドライブは<br />ありません</p>
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
                onComplete={() => handleComplete(drive.id)} // ここで実行
              />
            ))
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}