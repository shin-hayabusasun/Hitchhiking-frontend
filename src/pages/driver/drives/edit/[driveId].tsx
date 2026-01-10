import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Trash2, Dog, Music, Utensils, CigaretteOff, MessageSquare } from 'lucide-react';

export default function EditDrivePage() {
    const router = useRouter();
    const { driveId } = router.query;
    
    const [formData, setFormData] = useState({
        departure: '', destination: '', departureTime: '',
        capacity: 1, fee: 0, message: '',
        noSmoking: true, petAllowed: false, musicAllowed: true, foodAllowed: false,
    });
    const [loading, setLoading] = useState(true);

    // 変更点1: Fetch先のパスを /api/kaito/drives/ に修正
    useEffect(() => {
        if (!driveId) return;
        fetch(`/api/kaito/drives/${driveId}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setFormData({
                        ...data.drive,
                        noSmoking: data.drive.vehicleRules.noSmoking || false,
                        petAllowed: data.drive.vehicleRules.petAllowed || false,
                        musicAllowed: data.drive.vehicleRules.musicAllowed || false,
                        foodAllowed: data.drive.vehicleRules.foodAllowed || false,
                        message: data.drive.message || ''
                    });
                }
                setLoading(false);
            })
            .catch(err => console.error("読み込みエラー:", err));
    }, [driveId]);

    // 変更点2: 更新(PUT)のパスを /api/kaito/drives/ に修正
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
                router.push('/driver/drives');
            } else {
                alert("更新に失敗しました: " + (result.detail || "不明なエラー"));
            }
        } catch (err) {
            alert("通信エラーが発生しました");
        }
    };

    // 変更点3: 削除(DELETE)のパスを /api/kaito/drives/ に修正
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
                router.push('/driver/drives');
            }
        } catch (err) {
            alert("削除に失敗しました");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-600">データを読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] shadow-2xl flex flex-col font-sans border-[8px] border-white bg-gradient-to-b from-sky-100 to-white rounded-[3rem] overflow-hidden h-[844px]">
                {/* ヘッダー */}
                <div className="bg-white p-6 flex items-center justify-between border-b">
                    <button onClick={() => router.push('/driver/drives')} className="hover:bg-gray-100 p-2 rounded-full transition"><ArrowLeft /></button>
                    {/* 自分の作成中画面だとわかるようにタイトル微修正 */}
                    <h1 className="text-green-600 font-extrabold text-xl">募集の編集 (Kaito)</h1>
                    <button onClick={handleDelete} className="text-red-400 hover:text-red-600 p-2 transition"><Trash2 size={22} /></button>
                </div>

                <form onSubmit={handleSave} className="p-5 space-y-5 overflow-y-auto pb-10">
                    {/* ルート設定 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                            <MapPin size={20} /> <span className="font-bold">ルートの変更</span>
                        </div>
                        <div className="space-y-3">
                            <input className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-400 outline-none transition" placeholder="出発地" value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} required />
                            <input className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-400 outline-none transition" placeholder="目的地" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required />
                        </div>
                    </div>

                    {/* 日時・基本設定 */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-green-600"><Calendar size={20} /><span className="font-bold">スケジュール</span></div>
                        <input type="datetime-local" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 ml-2">定員</span>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} min="1" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 ml-2">料金</span>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl" value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} min="0" />
                            </div>
                        </div>
                    </div>

                    {/* 車内ルール */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-green-600 font-bold mb-2"><CigaretteOff size={20}/> 車内ルール</div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { key: 'noSmoking', label: '禁煙', icon: <CigaretteOff size={18}/> },
                                { key: 'petAllowed', label: 'ペット可', icon: <Dog size={18}/> },
                                { key: 'musicAllowed', label: '音楽OK', icon: <Music size={18}/> },
                                { key: 'foodAllowed', label: '飲食OK', icon: <Utensils size={18}/> }
                            ].map(item => (
                                <button key={item.key} type="button" 
                                    onClick={() => setFormData({...formData, [item.key]: !formData[item.key as keyof typeof formData]})}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition font-bold ${formData[item.key as keyof typeof formData] ? 'bg-green-500 border-green-500 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400'}`}>
                                    {item.icon} <span className="text-xs">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 自己紹介/メッセージ */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-green-600 font-bold"><MessageSquare size={20}/> メッセージ</div>
                        <textarea className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px] text-sm" placeholder="メッセージを入力..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>

                    <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-3xl font-black text-lg shadow-xl hover:bg-green-700 active:scale-95 transition-all">
                        設定を保存して更新
                    </button>
                </form>
            </div>
        </div>
    );
}