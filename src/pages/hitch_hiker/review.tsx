// src/pages/driver/drivekanri/review.tsx

import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PassengerReviewPage() {
  const router = useRouter();
  
  // 1. URLパラメータからは募集IDのみを受け取る
  const { recruitmentId } = router.query;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. 送信ボタンを押したときの処理
  const handleSubmit = async () => {
    // バリデーション：recruitmentId が無い場合はエラー
    if (!recruitmentId) {
      alert("エラー: 募集IDが取得できませんでした。");
      return;
    }
    if (rating === 0) {
      alert("星を選択してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/hitchhiker/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          recruitment_id: Number(recruitmentId),
          rating: rating,
          comment: comment
        }),
      });

      // JSONを解析して中身を確認
      const data = await response.json();

      // ★ 追加: 二重投稿チェックロジック
      if (response.ok && data.ok === false && data.status === "already_reviewed") {
        alert("このドライブに対するレビューは既に投稿済みです。相手の評価をお待ちください。");
        // 既に終わっているので、履歴（完了）画面へ飛ばす
        router.push("/driver/drivekanri/completion");
        return;
      }

      // 通常のエラーハンドリング
      if (!response.ok) {
        throw new Error(data.detail || '送信に失敗しました');
      }

      alert("レビューを送信しました。");
      router.push("/driver/drivekanri/completion");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* スマホ画面外枠 */}
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-white overflow-y-auto rounded-[2rem]">
        
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 border-b bg-white sticky top-0 z-10">
          <button onClick={() => router.back()} disabled={isSubmitting} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold">レビュー</h1>
        </div>

        <main className="p-6 space-y-8">
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold text-gray-800">ドライブの評価</h2>
            <p className="text-sm text-gray-500 mt-2">レビュー完了後に決済情報を使って、自動で送金します</p>
          </div>

          {/* 星評価セクション */}
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <button 
                key={i} 
                onClick={() => setRating(i)}
                disabled={isSubmitting}
                type="button"
                className="transition-transform active:scale-90"
              >
                <Star
                  size={40}
                  className={
                    i <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }
                />
              </button>
            ))}
          </div>

          {/* コメント入力セクション */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="相手へのメッセージや感想を書きましょう（任意）"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98]
                ${isSubmitting || rating === 0 
                  ? 'bg-gray-300 shadow-none cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  送信中...
                </div>
              ) : "レビューを確定する"}
            </button>
          </div>
        </main>

        <div className="h-10" />
      </div>
    </div>
  );
}