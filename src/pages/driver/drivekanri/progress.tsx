// % Start(ProgressPage)
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import DriveStatusCard from "@/components/driver/DriveStatusCard";
import { getApiUrl } from "@/config/api";

interface OngoingDrive {
    id: string;
    application_id: number;
    from_loc: string;
    to_loc: string;
    datetime: string;
    price: number;
    driver: {
        name: string;
        rating: number;
        driveCount: number;
    };
}

export default function Progress() {
    const router = useRouter();
    const [drives, setDrives] = useState<OngoingDrive[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProgress = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(getApiUrl("/api/driver/progress"), {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDrives(data.drives || []);
        } catch (error) {
            console.error("進行中データの取得失敗:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    const handleComplete = async (id: string) => {
        if (!confirm("このドライブを完了状態にしますか？")) return;

        try {
            const response = await fetch(getApiUrl("/api/driver/complete"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ driveId: parseInt(id, 10) }),
            });

            const result = await response.json();
            if (response.ok && result.ok) {
                alert("ドライブを完了しました。お疲れ様でした！");
                await fetchProgress();
            } else {
                alert(result.message || "完了処理に失敗しました");
            }
        } catch (error) {
            console.error("完了処理エラー:", error);
            alert("通信エラーが発生しました");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
            {/* Header: 背景全幅、タイトル行のみを固定。タブへの干渉を防ぐため。 */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full shadow-sm">
                <div className="max-w-2xl mx-auto w-full px-5 py-4 flex items-center gap-3">
                    <button 
                        onClick={() => router.back()}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold">ドライブ管理</h1>
                </div>
            </header>

            {/* メインコンテンツ: max-w-2xl 中央寄せ */}
            <main className="max-w-2xl mx-auto w-full">
                {/* ステータスタブ: ヘッダーの外に配置し、背景色(gray-100)と馴染ませる */}
                <div className="px-4 py-6">
                    <div className="flex bg-gray-200 p-1 rounded-full text-sm font-medium">
                        <button
                            onClick={() => router.push("/driver/drivekanri/schedule")}
                            className="flex-1 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            予定中
                        </button>
                        <div className="flex-1 py-2 bg-white rounded-full shadow-sm text-center text-blue-600 font-bold">
                            進行中
                        </div>
                        <button
                            onClick={() => router.push("/driver/drivekanri/completion")}
                            className="flex-1 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            完了
                        </button>
                    </div>
                </div>

                {/* リスト表示部分 */}
                <div className="px-4 pb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
                            <p className="text-xs font-bold text-black uppercase tracking-widest">データを読み込み中...</p>
                        </div>
                    ) : drives.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="font-bold text-gray-400 tracking-tight">進行中のドライブはありません</p>
                            <p className="text-[10px] text-gray-300 mt-1 uppercase font-medium tracking-widest">No drives in progress</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {drives.map((drive) => (
                                <DriveStatusCard
                                    key={drive.id}
                                    status="progress"
                                    from={drive.from_loc}
                                    to={drive.to_loc}
                                    datetime={drive.datetime}
                                    price={drive.price}
                                    driver={drive.driver}
                                    onChat={() => router.push(`/chat/${drive.application_id}`)}
                                    onComplete={() => handleComplete(drive.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
// % End