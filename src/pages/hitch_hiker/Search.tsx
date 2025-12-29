// % Start(稗田隼也)
// 募集検索画面: 同乗者向けの募集検索画面を表示するUI

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import { SearchCard } from '@/components/hitch_hiker/SearchCard';

type caritem = {
	jouken_name: string;
};
type Drive= {
	id: string;// 募集ID
	name: string;// ドライバー名
	start: string;// 出発地
	end: string;// 目的地
	date: string;// 出発日時 2025-12-31 23:59
	money: number;// 料金
	people: number;// 定員
	match?: number;// マッチングスコア（オプション）
	carinfo: string;// 車両情報
	state: string;// 募集状態
	car_jouken: caritem[];// 車両条件
}

interface card{
	card: Drive[];
}

export function SearchPage() {
	const router = useRouter();
	const [drives, setDrives] = useState<Drive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// 募集情報取得
	useEffect(() => {
		async function fetchRecruitments() {
			try {
				const response = await fetch('/api/hitchhiker/boshukensaku', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				setDrives(data || []);
			} catch (err) {
				setError('募集情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchRecruitments();
	}, []);

	function handleManagementClick() {
		router.push('/hitch_hiker/RecruitmentManagement');
	}

	function handleCreateClick() {
		router.push('/hitch_hiker/passenger/CreateDrivePassenger');
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			 <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl overflow-hidden flex flex-col font-sans bg-white  border-[8px] relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white">
		
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24">
            {/* ヘッダー：titleを「同乗者として利用」にすると以前のロジックで青文字になります */}
            <HitchhikerHeader title="同乗者として利用" />

            {/* タブ切り替えセクション */}
            <div className="flex px-4 py-4 gap-2">
                <button className="flex-1 bg-white py-3 rounded-xl shadow-sm border border-blue-100 text-gray-800 font-bold text-sm">
                    募集検索
                </button>
                <button onClick={handleManagementClick} className="flex-1 bg-gray-200/50 py-3 rounded-xl text-gray-500 font-bold text-sm flex items-center justify-center gap-2">
                    募集管理
                    <span className="bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">1</span>
                </button>
            </div>

            {/* 検索入力セクション */}
            <div className="px-4 mb-6">
                <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-3">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        </span>
                        <input type="text" placeholder="出発地を入力" className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        </span>
                        <input type="text" placeholder="目的地を入力" className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            検索
                        </button>
                        <button className="w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-500 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 検索結果リスト */}
            <div className="flex-1 px-4 overflow-y-auto">
                {drives.map((drive) => (
                    <SearchCard
                        key={drive.id}
                        {...drive}
                    />
                ))}
            </div>

            {/* 下部固定ボタン：画像（image_45ab84.png）の⑦番 */}
            <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[390px] mx-auto">
                <button onClick={handleCreateClick} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <span className="text-xl">+</span>
                    同乗者として募集を作成
                </button>
            </div>
        </div>
		</div>
		</div>
	);
}

export default SearchPage;

// % End

