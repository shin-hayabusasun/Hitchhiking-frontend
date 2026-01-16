import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Users, Trash2, Dog, Music, Utensils, CigaretteOff, MessageSquare, Loader2, Info } from 'lucide-react';

// ★バックエンドのアドレスを定数化
const API_BASE = 'http://localhost:8000/api/driver';

export default function EditDrivePage() {
    const router = useRouter();
    const { driveId } = router.query;
    
    const [formData, setFormData] = useState({
        departure: '', destination: '', departureTime: '',
        capacity: 1, fee: 0, message: '',
        noSmoking: true, petAllowed: false, musicAllowed: true, foodAllowed: false,
    });
    const [loading, setLoading] = useState(true);

    // 1. データ読み込み
    useEffect(() => {
        if (!driveId) return;

        // 相対パスから絶対パスに変更
        fetch(`${API_BASE}/schedules/${driveId}`, { credentials: 'include' })
            .then(async res => {
                if (!res.ok) throw new Error('データの取得に失敗しました');
                return res.json();
            })
            .then(data => {
                // バックエンドのキー名（スネークケース）をフロントのキー名に変換してセット
                // 注: data.departure_time など、バックエンドの実際のキー名に合わせて適宜修正してください
                setFormData({
                    departure: data.departure || '',
                    destination: data.destination || '',
                    departureTime: data.departure_time || data.departureTime || '',
                    capacity: data.capacity || 1,
                    fee: data.fee || 0,
                    message: data.message || '',
                    noSmoking: data.no_smoking ?? true,
                    petAllowed: data.pet_allowed ?? false,
                    musicAllowed: data.music_allowed ?? true,
                    foodAllowed: data.food_allowed ?? false,
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("読み込みエラー:", err);
                // エラーメッセージを表示するか、管理画面に戻す
                setLoading(false);
            });
    }, [driveId]);

    // 2. 更新処理
    const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. departureTime (YYYY-MM-DDTHH:mm) を分割する
    // 例: "2026-01-13T17:30" -> ["2026-01-13", "17:30"]
    const [date, time] = formData.departureTime.split('T');

    // 2. バックエンドが期待する形式にデータを整形
    const payload = {
        ...formData,
        departureDate: date,   // 分割した日付をセット
        departureTime: time,   // 分割した時刻をセット
    };

    try {
        const res = await fetch(`${API_BASE}/schedules/${driveId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload), // 整形した payload を送る
            credentials: 'include'
        });
        
        const result = await res.json();
        if (res.ok && result.ok) {
            alert("ドライブ情報を更新しました！");
            router.push('/driver/drives');
        } else {
            alert("更新に失敗しました: " + (result.detail?.[0]?.msg || result.detail || "不明なエラー"));
        }
    } catch (err) {
        alert("通信エラーが発生しました");
    }
};

    // 3. 削除処理（先ほどのAPIを使用）
    const handleDelete = async () => {
        if (!confirm("この募集を完全に削除しますか？\n関連する取引データもすべて削除されます。")) return;
        try {
            const res = await fetch(`${API_BASE}/schedules/${driveId}`, { 
                method: 'DELETE', 
                credentials: 'include' 
            });
            const result = await res.json();
            if (res.ok && result.ok) {
                alert("削除しました");
                router.push('/driver/drives/management');
            } else {
                alert(result.detail || "削除に失敗しました");
            }
        } catch (err) {
            alert("削除に失敗しました");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#10B981] font-bold gap-2">
            <Loader2 className="animate-spin" /> データを読み込み中...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
                {/* ヘッダー */}
                <div className="bg-white p-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
                    <button type="button" onClick={() => router.back()} className="hover:bg-slate-50 p-2 rounded-full transition"><ArrowLeft className="text-slate-400" /></button>
                    <h1 className="text-[#10B981] font-extrabold text-xl">募集を編集</h1>
                    <button type="button" onClick={handleDelete} className="text-red-300 hover:text-red-500 p-2 transition"><Trash2 size={22} /></button>
                </div>

                <form onSubmit={handleSave} className="p-5 space-y-5 overflow-y-auto pb-10 scrollbar-hide flex-1">
                    {/* ルート設定 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981]">
                            <MapPin size={18} /> <span className="font-bold text-xs uppercase tracking-wider">Route</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 ml-2 mb-1 block">出発地</label>
                                <input className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-200 outline-none transition text-sm" placeholder="例：高知駅" value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 ml-2 mb-1 block">目的地</label>
                                <input className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-200 outline-none transition text-sm" placeholder="例：高知工科大学" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required />
                            </div>
                        </div>
                    </div>

                    {/* スケジュール */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase"><Calendar size={18} /> Schedule</div>
                        <input type="datetime-local" className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 ml-2">定員</label>
                                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-sm" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} min="1" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 ml-2">料金</label>
                                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-sm" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} min="0" />
                            </div>
                        </div>
                    </div>

                    {/* ルール（プロフィール誘導メッセージ版） */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase"><Info size={18}/> Vehicle Rules</div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-50">
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                車両ルールはプロフィール設定の内容が自動適用されます。変更が必要な場合はマイページより修正してください。
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase"><MessageSquare size={18}/> Message</div>
                        <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none min-h-[100px] text-sm" placeholder="補足メッセージを入力..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>

                    <button type="submit" className="w-full py-5 bg-[#10B981] text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all mb-4">
                        更新を保存する
                    </button>
                </form>
            </div>
        </div>
    );
}