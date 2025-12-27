// % Start(田所櫂人)
import React from 'react';
import { useRouter } from 'next/router';
import { RecruitmentManagementCard } from '../../components/hitch_hiker/cards/RecruitmentManagementCard';

export const RecruitmentManagement: React.FC = () => {
    const router = useRouter();

    // 本来はAPIから取得するデータ例
    const dummyRecruits = [
        { id: '1', state: '募集中', start: '松山市', end: '今治市', date: '2025/12/30 10:00', money: 1500, people: 2, registrationdate: '2025/12/20' }
    ];

    const handleEdit = (id: string) => {
        // フローチャート：募集テーブルIDを編集画面に送り、推移
        router.push(`/hitch_hiker/edit?id=${id}`);
    };

    const handleDelete = (id: string) => {
        // フローチャート：募集テーブルIDを削除画面に送り、推移
        if(confirm('削除しますか？')) {
            router.push(`/hitch_hiker/delete?id=${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <header className="bg-white px-6 py-4 flex items-center sticky top-0 z-50 border-b border-slate-50">
                <button onClick={() => router.back()} className="text-slate-600 mr-4">←</button>
                <h1 className="text-[17px] font-bold text-slate-800">募集管理</h1>
            </header>
            <main className="p-4 max-w-md mx-auto">
                {dummyRecruits.map(rec => (
                    <RecruitmentManagementCard 
                        key={rec.id}
                        {...rec}
                        onEdit={() => handleEdit(rec.id)}
                        onDelete={() => handleDelete(rec.id)}
                    />
                ))}
            </main>
        </div>
    );
};
export default RecruitmentManagement;
// % End