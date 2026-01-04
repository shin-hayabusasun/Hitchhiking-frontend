// src/pages/driver/drivekanri/schedule.tsx
import { ArrowLeft, Clock, MapPin, Calendar, Users, DollarSign, User } from "lucide-react";
import { useRouter } from "next/router";

export default function Schedule() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] bg-gray-100 shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">

        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">ドライブ管理</h1>
        </div>

        {/* Tabs */}
        <div className="mx-4 mt-4 bg-gray-200 rounded-full p-1 flex text-sm">
          <div className="flex-1 bg-white rounded-full py-2 text-center font-semibold shadow">
            予定中
          </div>
          <button onClick={() => router.push("/driver/drivekanri/progress")} className="flex-1 py-2">
            進行中
          </button>
          <button onClick={() => router.push("/driver/drivekanri/completion")} className="flex-1 py-2">
            完了
          </button>
        </div>

        {/* Card */}
        <div className="p-4">
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">

            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">
                <Clock size={12} /> 予定中
              </span>
              <span className="text-xs text-gray-400">作成日: 2025-11-03</span>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex gap-2 items-center">
                <MapPin className="text-green-600" size={16} /> 東京駅
              </div>
              <div className="flex gap-2 items-center">
                <MapPin className="text-red-500" size={16} /> 横浜駅
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> 2025-11-15 09:00
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <DollarSign size={14} /> ¥800 / 人
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> 2名
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <p>申請アカウント 2件</p>
                <p className="text-green-600">承認済み 1件</p>
              </div>
              <button className="text-blue-600 flex items-center gap-1">
                <User size={18} /> 確認
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 border rounded-xl py-2 text-sm">
                編集
              </button>
              <button className="flex-1 border rounded-xl py-2 text-sm text-red-600">
                キャンセル
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
