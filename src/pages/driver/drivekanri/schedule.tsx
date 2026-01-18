// src/pages/driver/drivekanri/schedule.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  ChevronRight 
} from "lucide-react";
import { getApiUrl } from "@/config/api";

// 型定義
interface ScheduleItem {
  id: string;
  createdAt: string;
  depName: string;
  arrName: string;
  depTime: string;
  fare: number;
  capacity: number;
  status: string;
}

export default function Schedule() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // データ取得処理 (fetch API を使用)
  useEffect(() => {
  const fetchSchedules = async () => {
    try {
      // credentials: "include" を追加してクッキーを送信可能にする
      const response = await fetch(getApiUrl("/api/driver/schedules"), {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSchedules(data.schedules);
    } catch (error) {
      console.error("データ取得失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSchedules();
}, []);

function handleDel(id: string) {
    return async () => {
      try {
        await fetch(getApiUrl(`/api/driver/schedules/${id}`), {
          method: "DELETE",
          credentials: "include",
        });
        setSchedules((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("削除失敗:", error);
      }
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-gray-800">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-50 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto rounded-[2rem]">

        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100">
          <button 
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">ドライブ管理</h1>
        </div>

        {/* Tabs */}
        <div className="mx-4 mt-4 bg-gray-200 rounded-full p-1 flex text-sm font-medium">
          <div className="flex-1 bg-white rounded-full py-2 text-center shadow-sm text-blue-600">
            予定中
          </div>
          <button 
            onClick={() => router.push("/driver/drivekanri/progress")} 
            className="flex-1 py-2 text-gray-500"
          >
            進行中
          </button>
          <button 
            onClick={() => router.push("/driver/drivekanri/completion")} 
            className="flex-1 py-2 text-gray-500"
          >
            完了
          </button>
        </div>
        <p className="text-gray-400 text-sm">あなたが募集しているリスト</p>
        {/* List */}
        <div className="p-4 space-y-4">
          {schedules.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">予定されているドライブは<br />ありません</p>
            </div>
          ) : (
            
            schedules.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                
                {/* ステータス & 作成日 */}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-1 rounded-full uppercase">
                    <Clock size={12} /> {item.status}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">作成: {item.createdAt}</span>
                </div>

                {/* 経路情報 */}
                <div className="space-y-3 border-l-2 border-dashed border-gray-200 ml-2 pl-4 relative">
                  <div className="flex gap-2 items-center relative">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    <span className="text-sm font-semibold">{item.depName}</span>
                  </div>
                  <div className="flex gap-2 items-center relative">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    <span className="text-sm font-semibold">{item.arrName}</span>
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="grid grid-cols-2 gap-y-2 text-[13px] bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 col-span-2 text-gray-700">
                    <Calendar size={14} className="text-gray-400" /> 
                    <span className="font-medium">{item.depTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 font-bold">
                    <DollarSign size={14} /> ¥{item.fare.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 justify-end text-gray-500">
                    <Users size={14} /> {item.capacity}名まで
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 pt-1">
                  <button 
                    onClick={() => router.push(`/driver/requests`)}
                    className="flex-[2] bg-blue-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    詳細・申請を確認 <ChevronRight size={14} />
                  </button>
                  <button 
                    onClick={handleDel(item.id)} className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    消去
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}