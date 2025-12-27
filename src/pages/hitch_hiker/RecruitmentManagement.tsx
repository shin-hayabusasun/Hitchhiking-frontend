// % Start(田所櫂人)
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// ↓ここを修正しました
import RecruitmentManagementCard from '../../components/hitch_hiker/RecruitmentManagementCard';

export const RecruitmentManagement: React.FC = () => {
    const router = useRouter();

    const dummyRecruits = [
        { 
            id: '1', 
            state: '募集中', 
            start: '松山市', 
            end: '今治市', 
            date: '2025/12/30 10:00', 
            money: 1500, 
            people: 2, 
            registrationdate: '2025/12/28' 
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Head>
                <title>募集管理</title>
            </Head>

            <header className="bg-white px-6 py-4 flex items-center sticky top-0 z-50 border-b border-slate-100">
                <button onClick={() => router.back()} className="text-slate-600 mr-4 text-xl">←</button>
                <h1 className="text-[17px] font-bold text-slate-800">募集管理</h1>
            </header>

            <main className="p-4 max-w-md mx-auto">
                {dummyRecruits.map(rec => (
                    <RecruitmentManagementCard 
                        key={rec.id}
                        state={rec.state}
                        start={rec.start}
                        end={rec.end}
                        date={rec.date}
                        money={rec.money}
                        people={rec.people}
                        registrationdate={rec.registrationdate}
                        onEdit={() => router.push(`/hitch_hiker/edit?id=${rec.id}`)}
                        onDelete={() => { if(confirm('この募集を削除しますか？')) console.log('Delete ID:', rec.id); }}
                    />
                ))}
            </main>
        </div>
    );
};

export default RecruitmentManagement;
// % End