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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full px-4 py-3 pt-8 flex items-center">
            <button 
              onClick={() => router.back()} 
              disabled={isSubmitting} 
              className="text-gray-400 p-1.5 hover:bg-gray-50 border border-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-sm font-black text-gray-800 flex-1 text-center mr-8">レビューを入力</h1>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-5">
            
            {/* 評価カード */}
            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-8 text-center">
              <div>
                <h2 className="text-sm font-black text-gray-700 mb-1">ドライブはいかがでしたか？</h2>
                <p className="text-[11px] text-gray-400 font-bold">レビュー完了後に決済情報を使って、自動で送金します</p>
              </div>

              {/* 星評価セクション */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button 
                      key={i} 
                      onClick={() => setRating(i)}
                      disabled={isSubmitting}
                      type="button"
                      className="transition-transform active:scale-90 disabled:opacity-50"
                    >
                      <Star
                        size={32}
                        className={
                          i <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-100"
                        }
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-xl font-black text-gray-700">{rating}.0</span>
                )}
              </div>

              {/* コメント入力セクション */}
              <div className="text-left space-y-2">
                <div className="flex items-center space-x-2 ml-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    Comment
                  </label>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="相手へのメッセージや感想を書きましょう（任意）"
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 leading-relaxed transition-all"
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </main>

        {/* 送信ボタン (フッター固定) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto w-full p-5 flex space-x-3">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-white border border-gray-200 text-gray-500 py-3.5 rounded-xl font-black text-sm active:scale-95 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className={`flex-[2] py-3.5 rounded-xl font-black text-sm flex items-center justify-center shadow-lg transition-all active:scale-95
                ${isSubmitting || rating === 0 
                  ? 'bg-gray-400 text-white cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'}
              `}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "送信中..." : "レビューを確定する"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}