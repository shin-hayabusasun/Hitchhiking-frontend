// src/pages/driver/drivekanri/review.tsx

import { ArrowLeft, Star, Loader2, Send } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { getApiUrl } from "@/config/api";

export default function PassengerReviewPage() {
  const router = useRouter();
  
  // 1. URLパラメータからは募集IDのみを受け取る
  const { recruitmentId } = router.query;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. 送信ボタンを押したときの処理
  const handleSubmit = async () => {
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
      const response = await fetch(getApiUrl('/api/hitchhiker/reviews'), {
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

      const data = await response.json();

      if (response.ok && data.ok === false && data.status === "already_reviewed") {
        alert("このドライブに対するレビューは既に投稿済みです。相手の評価をお待ちください。");
        router.push("/driver/drivekanri/completion");
        return;
      }

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 pb-20">
      
      {/* ヘッダー: 横いっぱい白背景、中身は中央寄せ */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => router.back()} 
            disabled={isSubmitting} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[17px] font-black text-blue-600 flex-1 text-center mr-10">レビュー</h1>
        </div>
      </header>

      {/* メインコンテンツ: max-w-2xl */}
      <main className="max-w-2xl mx-auto p-5 space-y-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-gray-800">ドライブの評価</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              レビュー完了後に決済情報を使って、<br className="sm:hidden" />自動で送金します
            </p>
          </div>

          {/* 星評価セクション */}
          <div className="flex flex-col items-center bg-gray-50 rounded-[2rem] py-8 space-y-4">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <button 
                  key={i} 
                  onClick={() => setRating(i)}
                  disabled={isSubmitting}
                  type="button"
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={48}
                    className={
                      i <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-xl font-black text-gray-700">{rating} / 5</span>
            )}
          </div>

          {/* コメント入力セクション */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="相手へのメッセージや感想を書きましょう（任意）"
              className="w-full rounded-[1.5rem] border-none bg-gray-50 p-5 text-sm resize-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[160px] leading-relaxed"
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className={`w-full py-4 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center transition-all active:scale-95 shadow-xl
                ${isSubmitting || rating === 0 
                  ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}
              `}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? "送信中..." : "レビューを確定する"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}