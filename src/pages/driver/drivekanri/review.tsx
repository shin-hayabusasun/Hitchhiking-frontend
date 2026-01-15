// src/pages/driver/drivekanri/review.tsx

import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export function PassengerReviewPage() {
  const router = useRouter();
  
  // 1. URLパラメータから必要なIDを受け取る
  // (例: /review?recruitmentId=10&targetUserId=5)
  const { recruitmentId, targetUserId } = router.query;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ

  // 2. 送信ボタンを押したときの処理
  const handleSubmit = async () => {
    // バリデーション
    if (!recruitmentId || !targetUserId) {
      alert("エラー: 必要な情報(ID)が不足しています。");
      return;
    }
    if (rating === 0) {
      alert("星を選択してください");
      return;
    }

    setIsSubmitting(true);

    try {
      // APIを叩く
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // セッションCookieを送るために必須
        body: JSON.stringify({
          recruitment_id: Number(recruitmentId), // 数値型に変換
          target_user_id: Number(targetUserId),  // 数値型に変換
          rating: rating,
          comment: comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '送信に失敗しました');
      }

      // 成功したら完了画面へ遷移
      // (ここで相互レビュー完了なら決済完了メッセージなどを出すことも可能ですが、今回はシンプルに遷移)
      router.push("/driver/drivekanri/completion");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b">
        <button onClick={() => router.back()} disabled={isSubmitting}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold">レビュー</h1>
      </div>

      <main className="p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">ドライブの評価</h2>

          {/* Content */}
          <div className="p-6 space-y-6">

            <div className="text-center">
              <p className="font-medium mb-2">今回のドライブはいかがでしたか？</p>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button 
                    key={i} 
                    onClick={() => setRating(i)}
                    disabled={isSubmitting} // 送信中は変更不可
                    type="button"
                  >
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
                disabled={isSubmitting} // 送信中は入力不可
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0} // 送信中または星未選択なら押せない
              className={`w-full py-3 rounded-xl font-semibold text-white transition-colors
                ${isSubmitting || rating === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}