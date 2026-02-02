import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  Pencil,
  Car,
  Star,
  XCircle,
  PawPrint,
  AlertTriangle,
  Music,
  FileText,
} from "lucide-react";
import { getApiUrl } from "@/config/api";

/* ===== 型定義 ===== */
type DriverProfile = {
  name: string;
  initial: string;
  driveCount: number;
  rating: number;
  registeredAt: string;

  car: {
    model: string;
    color: string;
    year: number;
    number: string;
  };

  rules: {
    smoking: boolean;
    pet: boolean;
    food: boolean;
    music: boolean;
  };

  introduction: string;
};

export default function DriverProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===== データ取得 ===== */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/mypage"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      setError("プロフィールの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ===== ローディング・エラー ===== */
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center font-bold text-emerald-500">
        読み込み中...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    /* ★ 背景を w-full で全幅に広げ、中央寄せを適用 */
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-white flex flex-col items-center">
      
      {/* ★ コンテンツを max-w-2xl に制限。既存のシャドウや背景色を維持 */}
      <div className="w-full max-w-2xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-y-auto border-x border-gray-100">
        
        {/* ヘッダー（そのままのデザインで枠幅に追従） */}
        <header className="w-full sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="text-slate-600" />
          </button>
          <h1 className="font-black text-slate-800 text-lg">マイページ</h1>
          <button
            onClick={() => router.push("/driver/mypage/edit")}
            className="bg-emerald-50 text-[#10B981] font-black px-4 py-1.5 rounded-full flex items-center gap-1 text-sm hover:bg-emerald-100 transition-all"
          >
            <Pencil size={14} /> 編集
          </button>
        </header>

        <main className="w-full flex-1 p-5 space-y-5 pb-10">

          {/* ===== プロフィール概要 ===== */}
          <section className="w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-50 text-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black text-[#10B981] shadow-inner">
              {profile.initial}
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">{profile.name}</h2>

            <div className="w-full flex justify-around border-t border-slate-50 pt-6 text-center">
              <div className="flex-1">
                <p className="font-black text-xl text-slate-800">{profile.driveCount}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">ドライブ回数</p>
              </div>
              <div className="flex-1 border-x border-slate-50">
                <p className="font-black text-xl text-slate-800 flex items-center justify-center">
                  <Star size={18} className="text-yellow-400 fill-yellow-400 mr-1" />
                  {profile.rating}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">評価</p>
              </div>
              <div className="flex-1">
                <p className="font-black text-xl text-slate-800">{profile.registeredAt}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">登録日</p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => router.push("/driver/drivekanri/schedule")}
                className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl px-5 py-4 shadow-inner"
              >
                <div className="flex items-center gap-3 text-sm font-black text-slate-700">
                  <span className="p-2 bg-white rounded-xl shadow-sm"><FileText size={18} className="text-[#10B981]" /></span>
                  ドライブ管理
                </div>
                <span className="text-slate-300 font-bold text-xl">›</span>
              </button>
            </div>
          </section>

          {/* ===== 車両情報 ===== */}
          <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
            <h3 className="font-black text-slate-400 text-xs uppercase tracking-wider mb-4 ml-1 flex items-center gap-2">
              <Car size={16} /> 車両情報
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "車種", value: profile.car.model },
                { label: "色", value: profile.car.color },
                { label: "年式", value: `${profile.car.year}年` },
                { label: "ナンバー", value: profile.car.number },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <span className="text-xs font-bold text-slate-400">{item.label}</span>
                  <span className="text-sm font-black text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ===== 車両ルール ===== */}
          <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50 space-y-4">
            <h3 className="font-black text-slate-400 text-xs uppercase tracking-wider ml-1">車両ルール</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "禁煙", icon: <XCircle size={18} className="text-red-500" />, on: profile.rules.smoking },
                { label: "ペット可", icon: <PawPrint size={18} className="text-orange-500" />, on: profile.rules.pet },
                { label: "飲食OK", icon: <AlertTriangle size={18} className="text-yellow-500" />, on: profile.rules.food },
                { label: "音楽OK", icon: <Music size={18} className="text-purple-500" />, on: profile.rules.music },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <div className="flex items-center gap-3 text-sm font-black text-slate-700">
                    <span className="p-2 bg-white rounded-xl shadow-sm">{item.icon}</span>
                    {item.label}
                  </div>
                  <div className={`w-12 h-7 rounded-full px-1 flex items-center transition-all duration-300 ${item.on ? "bg-[#10B981]" : "bg-slate-300"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${item.on ? "translate-x-5" : ""}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== 自己紹介 ===== */}
          <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
            <h3 className="font-black text-slate-400 text-xs uppercase tracking-wider mb-3 ml-1">自己紹介</h3>
            <div className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
              <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                {profile.introduction || "自己紹介が設定されていません。"}
              </p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}