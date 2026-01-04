// src/pages/driver/drivekanri/review.tsx
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19]
           bg-white shadow-2xl border-[8px] border-white ring-1 ring-gray-200 overflow-y-auto">

        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 border-b">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold">レビュー</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          <div className="text-center">
            <p className="font-medium mb-2">今回のドライブはいかがでしたか？</p>

            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map((i) => (
                <button key={i} onClick={() => setRating(i)}>
                  <Star
                    size={32}
                    className={
                      i <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを書く（任意）"
              className="w-full rounded-xl border p-3 text-sm resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={() => router.push("/driver/drivekanri/completion")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            送信する
          </button>

        </div>
      </div>
    </div>
  );
}
