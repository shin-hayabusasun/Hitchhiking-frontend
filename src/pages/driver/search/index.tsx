// // % Start(AI Assistant)
// // 募集検索画面。条件を指定して同乗者の募集を検索する。

// import { useEffect, useState } from 'react';
// import { DriverHeader } from '@/components/driver/DriverHeader';
// import { useRouter } from 'next/router';
// import { Plus } from 'lucide-react';

// interface PassengerRequest {
// 	id: string;
// 	passengerName: string;
// 	departure: string;
// 	destination: string;
// 	date: string;
// 	time: string;
// 	budget: number;
// 	matchingScore: number;
// }

// export function DriverSearchPage() {
// 	const router = useRouter();
// 	const currentPath = router.pathname; // 現在のURLを取得

// 	// どのページがどのパスに対応するか定義
// 	const tabs = [
// 		{ name: 'マイドライブ', path: '/driver/drives' },
// 		{ name: '申請確認', path: '/driver/requests' },
// 		{ name: '近くの募集', path: '/driver/nearby' },
// 		{ name: '募集検索', path: '/driver/search' },
// 	];

// 	const [requests, setRequests] = useState<PassengerRequest[]>([]);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState('');
// 	const [filters, setFilters] = useState({
// 		from: '',
// 		to: '',
// 		date: '',
// 		minBudget: '',
// 		maxBudget: '',
// 	});

// 	async function handleSearch() {
// 		setLoading(true);
// 		setError('');

// 		try {
// 			const query = new URLSearchParams();
// 			Object.entries(filters).forEach(([key, value]) => {
// 				if (value) {
// 					query.append(key, value);
// 				}
// 			});

// 			const response = await fetch(`/api/passenger-requests?${query.toString()}`, {
// 				method: 'GET',
// 				credentials: 'include',
// 			});
// 			const data = await response.json();
// 			if (response.ok && data.requests) {
// 				setRequests(data.requests);
// 			}
// 		} catch (err) {
// 			setError('検索に失敗しました');
// 		} finally {
// 			setLoading(false);
// 		}
// 	}
// 	function handleCreateClick() {
// 		router.push('/driver/drives/create');
// 	}

// 	return (
// 		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
// 			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
// 				<div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
// 					<DriverHeader title="マイドライブ" />
// 				</div>

// 				<main className="flex-1 p-4 pb-10">

// 					{/* タブメニュー（スマホ用にフォントサイズ調整） */}
// 					<div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm">
// 						{tabs.map((tab) => {
// 							const isActive = currentPath === tab.path;
// 							return (
// 								<button
// 									key={tab.id}
// 									type="button"
// 									className={`py-2 text-[10px] font-bold rounded-lg transition-all duration-200 ${isActive
// 										? 'bg-white text-black shadow-sm'
// 										: 'text-gray-500 hover:text-gray-700'
// 										}`}
// 									onClick={() => router.push(tab.path)}
// 								>
// 									{tab.name}
// 								</button>
// 							);
// 						})}
// 					</div>

// 					<div className="bg-white p-6 rounded-lg shadow-md mb-6">
// 						<h3 className="text-lg font-bold mb-4">検索条件</h3>
// 						<div className="space-y-4">
// 							<div className="grid grid-cols-2 gap-4">
// 								<div>
// 									<label className="block text-gray-700 text-sm font-bold mb-2">
// 										出発地エリア
// 									</label>
// 									<input
// 										type="text"
// 										className="shadow border rounded w-full py-2 px-3"
// 										value={filters.from}
// 										onChange={(e) =>
// 											setFilters({ ...filters, from: e.target.value })
// 										}
// 										placeholder="例: 東京"
// 									/>
// 								</div>
// 								<div>
// 									<label className="block text-gray-700 text-sm font-bold mb-2">
// 										目的地エリア
// 									</label>
// 									<input
// 										type="text"
// 										className="shadow border rounded w-full py-2 px-3"
// 										value={filters.to}
// 										onChange={(e) =>
// 											setFilters({ ...filters, to: e.target.value })
// 										}
// 										placeholder="例: 横浜"
// 									/>
// 								</div>
// 							</div>

// 							<div>
// 								<label className="block text-gray-700 text-sm font-bold mb-2">
// 									希望日
// 								</label>
// 								<input
// 									type="date"
// 									className="shadow border rounded w-full py-2 px-3"
// 									value={filters.date}
// 									onChange={(e) =>
// 										setFilters({ ...filters, date: e.target.value })
// 									}
// 								/>
// 							</div>

// 							<div className="grid grid-cols-2 gap-4">
// 								<div>
// 									<label className="block text-gray-700 text-sm font-bold mb-2">
// 										予算（下限）
// 									</label>
// 									<input
// 										type="number"
// 										className="shadow border rounded w-full py-2 px-3"
// 										value={filters.minBudget}
// 										onChange={(e) =>
// 											setFilters({ ...filters, minBudget: e.target.value })
// 										}
// 										placeholder="円"
// 										min="0"
// 									/>
// 								</div>
// 								<div>
// 									<label className="block text-gray-700 text-sm font-bold mb-2">
// 										予算（上限）
// 									</label>
// 									<input
// 										type="number"
// 										className="shadow border rounded w-full py-2 px-3"
// 										value={filters.maxBudget}
// 										onChange={(e) =>
// 											setFilters({ ...filters, maxBudget: e.target.value })
// 										}
// 										placeholder="円"
// 										min="0"
// 									/>
// 								</div>
// 							</div>
// 						</div>

// 						<div className="mt-6 flex justify-end">
// 							<button
// 								onClick={handleSearch}
// 								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
// 								disabled={loading}
// 							>
// 								{loading ? '検索中...' : '検索'}
// 							</button>
// 						</div>
// 					</div>

// 					{error && <p className="text-red-500 text-center mb-4">{error}</p>}

// 					{requests.length > 0 && (
// 						<div className="bg-white p-6 rounded-lg shadow-md">
// 							<h3 className="text-lg font-bold mb-4">
// 								検索結果 ({requests.length}件)
// 							</h3>
// 							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// 								{requests.map((request) => (
// 									<div
// 										key={request.id}
// 										className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
// 										onClick={() => router.push(`/driver/search/${request.id}`)}
// 									>
// 										<div className="flex justify-between items-start mb-2">
// 											<h4 className="font-bold">
// 												{request.departure} → {request.destination}
// 											</h4>
// 											<span className="text-sm text-green-600 font-semibold">
// 												{request.matchingScore}%
// 											</span>
// 										</div>
// 										<p className="text-sm text-gray-600 mb-2">
// 											{request.date} {request.time}
// 										</p>
// 										<p className="text-sm text-gray-600 mb-2">
// 											同乗者: {request.passengerName}
// 										</p>
// 										<p className="text-blue-600 font-bold">
// 											予算: {request.budget.toLocaleString()}円
// 										</p>
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					)}
// 				</main>
// 				<div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent z-30">
// 					<button
// 						type="button"
// 						className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
// 						onClick={handleCreateClick}
// 					>
// 						<Plus size={20} /> ドライブを作成
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default DriverSearchPage;

// // % End

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { RecruitmentCard } from '@/components/driver/RecruitmentCard';
import { SearchFilters } from "../../_app"; 
import { Plus, Filter, MapPin, Search } from 'lucide-react';

type Props = {
  filter: SearchFilters;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
};

// APIレスポンス型定義
type PassengerRequest = {
  id: string;
  passengerName: string;
  start: string;
  end: string;
  date: string;
  money: number;
  people: number;
  match?: number;
  rating: number;
  reviewCount: number;
};

export default function DriverSearchPage({ filter, setFilter }: Props) {
  const router = useRouter();
  const currentPath = router.pathname; 

  const tabs = [
      { name: 'マイドライブ', path: '/driver/drives' },
      { name: '申請確認', path: '/driver/requests' },
      { name: '近くの募集', path: '/driver/nearby' },
      { name: '募集検索', path: '/driver/search' },
  ];

  const [requests, setRequests] = useState<PassengerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 募集情報取得
  const fetchRecruitments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://54.165.126.189:8000/api/driver/search', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter: filter }),
      });

      if (!response.ok) throw new Error('取得に失敗しました');
      const data = await response.json();
      setRequests(data.card || []);
    } catch (err) {
      setError('募集情報の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // 初回およびフィルター変更時に検索実行
  useEffect(() => {
    if(filter) {
        fetchRecruitments();
    }
  }, [fetchRecruitments]);

  if (!filter) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
        
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <DriverHeader title="募集検索" backPath="/"/>
        </div>

        <main className="flex-1 p-4 pb-24 scrollbar-hide">
          {/* タブメニュー */}
          <div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm">
              {tabs.map((tab) => {
                  const isActive = currentPath === tab.path;
                  return (
                      <button
                          key={tab.path}
                          type="button"
                          className={`py-2 text-[10px] font-bold rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => router.push(tab.path)}
                      >
                          {tab.name}
                      </button>
                  );
              })}
          </div>

          {/* 検索フォーム */}
          <div className="mb-6">
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="出発地" 
                  className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={filter.departure}
                  onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="目的地" 
                  className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={filter.destination}
                  onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={fetchRecruitments}
                  className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-transform"
                >
                  <Search className="w-4 h-4" /> 検索
                </button>
                <button onClick={() => router.push('/driver/search/filter')} className="w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-500 shadow-sm active:bg-gray-50">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 結果リスト */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500 text-sm font-bold">{error}</div>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <RecruitmentCard
                    key={req.id}
                    id={req.id}
                    passengerName={req.passengerName}
                    rating={req.rating}
                    reviewCount={req.reviewCount}
                    
                    // ★APIレスポンスをカードのPropsにマッピング
                    departure={req.start} 
                    destination={req.end}
                    budget={req.money}
                    date={req.date}
                    people={req.people}
                    matchingScore={req.match}
                    
                    // 検索画面では distance, startsIn は渡さない (undefinedでOK)
                    onClick={() => router.push(`/driver/search/${req.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm font-bold">
                <p>条件に合う募集は見つかりませんでした</p>
                <p className="text-xs font-normal mt-1">条件を変更して再度お試しください</p>
              </div>
            )}
          </div>
        </main>

        {/* 下部固定ボタン */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent z-30">
          <button onClick={() => router.push('/driver/regist_drive')} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Plus className="w-5 h-5" /> 運転者として募集を作成
          </button>
        </div>
      </div>
    </div>
  );
}