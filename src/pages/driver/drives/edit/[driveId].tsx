// % Start(EditDrivePage)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    ArrowLeft, 
    MapPin, 
    Calendar, 
    Users, 
    Trash2, 
    MessageSquare, 
    Loader2, 
    Info,
    DollarSign 
} from 'lucide-react';
import { getApiUrl } from '@/config/api';

export default function EditDrivePage() {
    const router = useRouter();
    const { driveId } = router.query;
    
    const [formData, setFormData] = useState({
        departure: '', destination: '', departureTime: '',
        capacity: 1, fee: 0, message: '',
        noSmoking: true, petAllowed: false, musicAllowed: true, foodAllowed: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!driveId) return;
        fetch(getApiUrl(`/api/driver/schedules/${driveId}`), { credentials: 'include' })
            .then(async res => {
                if (!res.ok) throw new Error('データの取得に失敗しました');
                return res.json();
            })
            .then(data => {
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
                setLoading(false);
            });
    }, [driveId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const [date, time] = formData.departureTime.split('T');
        const payload = {
            ...formData,
            departureDate: date,
            departureTime: time,
        };

        try {
            const res = await fetch(getApiUrl(`/api/driver/schedules/${driveId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok && result.ok) {
                alert("ドライブ情報を更新しました！");
                router.push('/driver/drivekanri/schedule');
            } else {
                alert("更新に失敗しました: " + (result.detail?.[0]?.msg || result.detail || "不明なエラー"));
            }
        } catch (err) {
            alert("通信エラーが発生しました");
        }
    };

    const handleDelete = async () => {
        if (!confirm("この募集を完全に削除しますか？\n関連する取引データもすべて削除されます。")) return;
        try {
            const res = await fetch(getApiUrl(`/api/driver/schedules/${driveId}`), { 
                method: 'DELETE', 
                credentials: 'include' 
            });
            const result = await res.json();
            if (res.ok && result.ok) {
                alert("削除しました");
                router.push('/driver/drivekanri/schedule');
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
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            
            {/* ヘッダー: 背景は全幅、中身は max-w-2xl 中央寄せ */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full shadow-sm">
                <div className="max-w-2xl mx-auto w-full px-5 py-4 flex items-center gap-3">
                    {/* 左側: 戻る */}
                    <button 
                        type="button" 
                        onClick={() => router.back()} 
                        className="p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    
                    {/* タイトル: 左寄せに変更 */}
                    <h1 className="text-[17px] font-black text-[#10B981] flex-1">
                        募集を編集
                    </h1>
                    
                    {/* 右側: 削除 */}
                    <button 
                        type="button" 
                        onClick={handleDelete} 
                        className="p-2 hover:bg-rose-50 rounded-full transition-colors text-rose-300 hover:text-rose-500"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            </header>

            {/* メインフォームコンテンツ: max-w-2xl で中央寄せ */}
            <main className="max-w-2xl mx-auto w-full p-5 pb-24">
                <form onSubmit={handleSave} className="space-y-6">
                    
                    {/* ルート設定 */}
                    <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 text-[#10B981] pl-1">
                            <MapPin size={18} /> 
                            <span className="font-black text-[11px] uppercase tracking-widest">Route Settings</span>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-tighter">出発地</label>
                                <input 
                                    className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-emerald-100 focus:bg-white outline-none transition-all text-[15px] font-bold" 
                                    placeholder="例：高知駅" 
                                    value={formData.departure} 
                                    onChange={e => setFormData({...formData, departure: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-tighter">目的地</label>
                                <input 
                                    className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-emerald-100 focus:bg-white outline-none transition-all text-[15px] font-bold" 
                                    placeholder="例：高知工科大学" 
                                    value={formData.destination} 
                                    onChange={e => setFormData({...formData, destination: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* スケジュール & 料金 */}
                    <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 text-[#10B981] pl-1">
                            <Calendar size={18} /> 
                            <span className="font-black text-[11px] uppercase tracking-widest">Schedule & Fee</span>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-tighter">出発日時</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full p-5 bg-gray-50 rounded-3xl outline-none text-[15px] font-bold focus:bg-white border-2 border-transparent focus:border-emerald-100 transition-all" 
                                    value={formData.departureTime} 
                                    onChange={e => setFormData({...formData, departureTime: e.target.value})} 
                                    required 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-tighter flex items-center gap-1">
                                        <Users size={12} /> 定員
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full p-5 bg-gray-50 rounded-3xl text-[15px] font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-100 transition-all" 
                                        value={formData.capacity} 
                                        onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} 
                                        min="1" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-tighter flex items-center gap-1">
                                        <DollarSign size={12} /> 料金
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full p-5 bg-gray-50 rounded-3xl text-[15px] font-bold outline-none focus:bg-white border-2 border-transparent focus:border-emerald-100 transition-all" 
                                        value={formData.fee} 
                                        onChange={e => setFormData({...formData, fee: Number(e.target.value)})} 
                                        min="0" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 車両ルール案内 */}
                    <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] pl-1 font-black text-[11px] uppercase tracking-widest">
                            <Info size={18}/> Vehicle Rules
                        </div>
                        <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-50">
                            <p className="text-[13px] text-emerald-700 font-bold leading-relaxed">
                                車両ルールはプロフィール設定の内容が自動適用されます。変更が必要な場合はマイページより修正してください。
                            </p>
                        </div>
                    </div>

                    {/* メッセージ */}
                    <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] pl-1 font-black text-[11px] uppercase tracking-widest">
                            <MessageSquare size={18}/> Additional Message
                        </div>
                        <textarea 
                            className="w-full p-6 bg-gray-50 rounded-3xl outline-none min-h-[150px] text-[15px] font-bold focus:bg-white border-2 border-transparent focus:border-emerald-100 transition-all resize-none" 
                            placeholder="同乗者への補足メッセージを入力..." 
                            value={formData.message} 
                            onChange={e => setFormData({...formData, message: e.target.value})} 
                        />
                    </div>

                    {/* 送信ボタン */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full py-5 bg-[#00B049] text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-emerald-100 hover:bg-emerald-600 active:scale-[0.98] transition-all"
                        >
                            更新を保存する
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
// % End