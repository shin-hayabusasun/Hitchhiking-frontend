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

/* ===== 型定義（趣味・目的・ライセンスを削除） ===== */
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">

        {/* ===== ヘッダー ===== */}
        <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h1 className="font-bold">マイページ</h1>
          <button
            onClick={() => router.push("/driver/mypage/edit")}
            className="text-blue-600 flex items-center gap-1 text-sm"
          >
            <Pencil size={16} /> 編集
          </button>
        </header>

        <main className="p-4 space-y-4 pb-8">

          {/* ===== プロフィール概要 ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-green-600">
              {profile.initial}
            </div>
            <h2 className="text-xl font-bold">{profile.name}</h2>

            {/* 本人確認・免許証確認バッジを削除 */}

            <div className="flex justify-around border-t pt-4 mt-4 text-sm">
              <div>
                <p className="font-bold text-lg">{profile.driveCount}</p>
                <p className="text-gray-500">ドライブ回数</p>
              </div>
              <div>
                <p className="font-bold text-lg flex items-center justify-center">
                  <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                  {profile.rating}
                </p>
                <p className="text-gray-500">評価</p>
              </div>
              <div>
                <p className="font-bold text-lg">{profile.registeredAt}</p>
                <p className="text-gray-500">登録日</p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => router.push("/driver/drivekanri/schedule")}
                className="w-full flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="text-green-600" />
                  ドライブ管理
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </section>

          {/* ===== 車両情報 ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm text-sm">
            <h3 className="font-bold text-gray-500 mb-3 flex items-center gap-2">
              <Car size={16} /> 車両情報
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">車種</span>
                <span className="font-medium">{profile.car.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">色</span>
                <span className="font-medium">{profile.car.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">年式</span>
                <span className="font-medium">{profile.car.year}年</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ナンバー</span>
                <span className="font-medium">{profile.car.number}</span>
              </div>
            </div>
          </section>

          {/* ===== 車両ルール ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-500 text-sm">車両ルール</h3>

            {[
              { label: "禁煙", icon: <XCircle className="text-red-500" />, on: profile.rules.smoking },
              { label: "ペット可", icon: <PawPrint className="text-orange-500" />, on: profile.rules.pet },
              { label: "飲食OK", icon: <AlertTriangle className="text-yellow-500" />, on: profile.rules.food },
              { label: "音楽OK", icon: <Music className="text-purple-500" />, on: profile.rules.music },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-sm font-medium">
                  {item.icon}
                  {item.label}
                </div>
                <div className={`w-11 h-6 rounded-full px-1 flex items-center transition-colors ${item.on ? "bg-blue-600" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.on ? "translate-x-5" : ""}`} />
                </div>
              </div>
            ))}
          </section>

          {/* ===== 自己紹介 ===== */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-500 text-sm mb-2">自己紹介</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {profile.introduction}
            </p>
          </section>

          {/* 趣味・目的・設定 セクションを削除 */}

        </main>
      </div>
    </div>
  );
}