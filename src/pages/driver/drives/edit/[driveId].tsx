import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Trash2, Dog, Music, Utensils, CigaretteOff, MessageSquare, Loader2 } from 'lucide-react';

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
        fetch(`/api/kaito/drives/${driveId}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.ok && data.drive) {
                    setFormData({
                        departure: data.drive.departure,
                        destination: data.drive.destination,
                        departureTime: data.drive.departureTime,
                        capacity: data.drive.capacity,
                        fee: data.drive.fee,
                        message: data.drive.message || '',
                        noSmoking: data.drive.vehicleRules.noSmoking,
                        petAllowed: data.drive.vehicleRules.petAllowed,
                        musicAllowed: data.drive.vehicleRules.musicAllowed,
                        foodAllowed: data.drive.vehicleRules.foodAllowed,
                    });
                }
                setLoading(false);
            })
            .catch(err => console.error("読み込みエラー:", err));
    }, [driveId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/kaito/drives/${driveId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const result = await res.json();
            if (result.ok) {
                alert("ドライブ情報を更新しました！");
                router.push('/driver/drives/management');
            } else {
                alert("更新に失敗しました: " + (result.detail || "不明なエラー"));
            }
        } catch (err) {
            alert("通信エラーが発生しました");
        }
    };

    const handleDelete = async () => {
        if (!confirm("この募集を削除（公開停止）しますか？")) return;
        try {
            const res = await fetch(`/api/kaito/drives/${driveId}`, { 
                method: 'DELETE', 
                credentials: 'include' 
            });
            const result = await res.json();
            if (result.ok) {
                alert("削除しました");
                router.push('/driver/drives/management');
            }
        } catch (err) {
            alert("削除に失敗しました");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-green-600 font-bold gap-2">
            <Loader2 className="animate-spin" /> データを読み込み中...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] shadow-2xl flex flex-col font-sans border-[8px] border-white bg-gradient-to-b from-emerald-50 to-white rounded-[3rem] overflow-hidden h-[844px]">
                {/* ヘッダー */}
                <div className="bg-white p-6 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10">
                    <button onClick={() => router.back()} className="hover:bg-slate-50 p-2 rounded-full transition"><ArrowLeft className="text-slate-400" /></button>
                    <h1 className="text-[#10B981] font-extrabold text-xl">募集を編集</h1>
                    <button onClick={handleDelete} className="text-red-300 hover:text-red-500 p-2 transition"><Trash2 size={22} /></button>
                </div>

                <form onSubmit={handleSave} className="p-5 space-y-5 overflow-y-auto pb-10 scrollbar-hide">
                    {/* ルート設定 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981]">
                            <MapPin size={18} /> <span className="font-bold text-xs uppercase tracking-wider">Route</span>
                        </div>
                        <div className="space-y-3">
                            <input className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-200 outline-none transition text-sm" placeholder="出発地（例：高知駅）" value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} required />
                            <input className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-200 outline-none transition text-sm" placeholder="目的地（例：大学）" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required />
                        </div>
                    </div>

                    {/* スケジュール・設定 */}
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

                    {/* ルール */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase"><CigaretteOff size={18}/> Vehicle Rules</div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { key: 'noSmoking', label: '禁煙', icon: <CigaretteOff size={16}/> },
                                { key: 'petAllowed', label: 'ペット可', icon: <Dog size={16}/> },
                                { key: 'musicAllowed', label: '音楽OK', icon: <Music size={16}/> },
                                { key: 'foodAllowed', label: '飲食OK', icon: <Utensils size={16}/> }
                            ].map(item => (
                                <button key={item.key} type="button" 
                                    onClick={() => setFormData({...formData, [item.key]: !formData[item.key as keyof typeof formData]})}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition font-bold ${formData[item.key as keyof typeof formData] ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-50 text-slate-300'}`}>
                                    {item.icon} <span className="text-[11px]">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase"><MessageSquare size={18}/> Message</div>
                        <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none min-h-[100px] text-sm" placeholder="メッセージ..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>

                    <button type="submit" className="w-full py-5 bg-[#10B981] text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all">
                        更新を保存する
                    </button>
                </form>
            </div>
        </div>
    );
}