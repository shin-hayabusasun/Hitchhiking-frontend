// % Start(PassengerReviewPage)
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { getApiUrl } from "@/config/api";

export default function PassengerReviewPage() {
  const router = useRouter();
  const { recruitmentId } = router.query;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recruitment_id: Number(recruitmentId),
          rating: rating,
          comment: comment
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok === false && data.status === "already_reviewed") {
        alert("このドライブに対するレビューは既に投稿済みです。相手の評価が終わり次第、決済を反映させます。");
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      {/* ヘッダー: 背景全幅、中身 max-w-2xl 中央寄せ。タイトルは左寄せ */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-2xl mx-auto w-full px-5 py-4 flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
          >
            <ArrowLeft size={24} />
          </button>
          
          <h1 className="text-lg font-bold text-gray-800">
            レビュー
          </h1>
        </div>
      </header>

      {/* メインコンテンツ: max-w-2xl 中央寄せ */}
      <main className="max-w-2xl mx-auto w-full p-5 pt-8 space-y-10 pb-32">
        
        <section className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">ドライブの評価</h2>
          <p className="text-sm font-bold text-gray-400">相手の評価が終わり次第、決済を反映させます</p>
        </section>

        {/* 星評価セクション */}
        <section className="flex justify-center gap-3 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button 
              key={i} 
              onClick={() => setRating(i)}
              disabled={isSubmitting}
              type="button"
              className="transition-transform active:scale-90 hover:scale-110"
            >
              <Star
                size={48}
                strokeWidth={1.5}
                className={
                  i <= rating
                    ? "text-[#00B049] fill-[#00B049]"
                    : "text-gray-200"
                }
              />
            </button>
          ))}
        </section>

        {/* コメント入力セクション */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1 h-4 bg-[#00B049] rounded-full" />
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Comment</label>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="相手へのメッセージや感想を書きましょう（任意）"
            className="w-full rounded-[2rem] border-2 border-transparent bg-white p-6 text-sm font-bold shadow-sm focus:border-[#00B049]/10 outline-none transition-all min-h-[180px] placeholder:text-gray-300"
            disabled={isSubmitting}
          />
        </section>
      </main>

      {/* 送信ボタンエリア: max-w-2xl 固定配置 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-5 z-40">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-[0.98]
            ${isSubmitting || rating === 0 
              ? 'bg-gray-200 shadow-none cursor-not-allowed text-gray-400' 
              : 'bg-[#00B049] text-white hover:opacity-90 shadow-green-100'}
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2 text-black">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>送信中...</span>
            </div>
          ) : (
            "レビューを確定する"
          )}
        </button>
      </div>
    </div>
  );
}
// % End