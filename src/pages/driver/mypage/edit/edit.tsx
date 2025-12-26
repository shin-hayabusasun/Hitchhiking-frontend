import { useRouter } from "next/router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";

export default function DriverEditPage() {
  const router = useRouter();

  // 仮の初期値
  const [name, setName] = useState("山田 太郎");
  const [introduction, setIntroduction] = useState(
    "安全運転を心がけています。静かに乗りたい方歓迎です。"
  );
  const [hobby, setHobby] = useState("ドライブ・音楽");
  const [vehicle, setVehicle] = useState("トヨタ プリウス");
  const [smoking, setSmoking] = useState(false);
  const [pet, setPet] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/driver")}
            className="rounded-full p-2 hover:bg-gray-200"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold">マイページ編集</h1>
        </div>

        {/* 基本情報 */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">基本情報</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                自己紹介
              </label>
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                趣味
              </label>
              <input
                type="text"
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* 車両情報 */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">車両情報</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                車種
              </label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">車内喫煙</span>
              <input
                type="checkbox"
                checked={smoking}
                onChange={() => setSmoking(!smoking)}
                className="h-5 w-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">ペット同乗</span>
              <input
                type="checkbox"
                checked={pet}
                onChange={() => setPet(!pet)}
                className="h-5 w-5"
              />
            </div>
          </div>
        </section>

        {/* 操作ボタン */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/driver")}
            className="flex-1 rounded-xl border bg-white py-3 font-medium"
          >
            キャンセル
          </button>

          <button
            onClick={() => {
              // ここでAPI保存
              router.push("/driver");
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white"
          >
            <Save size={18} />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
