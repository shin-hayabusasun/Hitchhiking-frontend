import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import { SearchCard } from '@/components/hitch_hiker/SearchCard';
import { SearchFilters } from "../_app"; // 型名を合わせる
import { getApiUrl } from '@/config/api';

type Props = {
  filter: SearchFilters;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
};

type caritem = {
  id: string;
  name: string;
};

type Drive = {
  id: string;
  name: string;
  start: string;
  end: string;
  date: string;
  money: number;
  people: number;
  match?: number;
  carinfo: string;
  state: string;
  car_jouken: caritem[];
};

export function SearchPage({ filter, setFilter }: Props) {
    if (!filter) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }
  const router = useRouter();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 募集情報取得ロジック（検索ボタンと共有するために関数化）
  const fetchRecruitments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/hitchhiker/boshukensaku'), {
        // body を使用するため、メソッドを POST に変更
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // filterオブジェクトをJSON文字列にしてbodyに設定
        body: JSON.stringify({
          filter: filter 
        }),
      });

      if (!response.ok) throw new Error('取得に失敗しました');

      const data = await response.json();
      setDrives(data.card || []); 
    } catch (err) {
      setError('募集情報の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);
  function handleManagementClick() {
    router.push('/hitch_hiker/RecruitmentManagement');
  }

  function handleCreateClick() {
    router.push('/hitch_hiker/passenger/CreateDrivePassenger');
  }

  function handleGofilter(){
    router.push('/hitch_hiker/SearchFilter')
  }
  useEffect(() => {
		fetchRecruitments();
	}, []);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl overflow-hidden flex flex-col font-sans bg-white border-[8px] relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white">
        
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24">
          <HitchhikerHeader title="同乗者として利用" />

          {/* タブ切り替え */}
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
              {/* 出発地 */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="出発地を入力" 
                  className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filter.departure}
                  onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                />
              </div>

              {/* 目的地 */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="目的地を入力" 
                  className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filter.destination}
                  onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={fetchRecruitments}
                  className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  検索
                </button>
                {/* フィルターボタン（詳細設定用） */}
                <button onClick={handleGofilter} className="w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-500 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* 検索結果リスト */}
          <div className="flex-1 px-4 overflow-y-auto">
            {loading ? (
              <div className="text-center py-10 text-gray-400">読み込み中...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : drives.length > 0 ? (
              drives.map((drive) => (
                <SearchCard key={drive.id} {...drive} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">該当する募集が見つかりません</div>
            )}
          </div>

          {/* 下部固定ボタン */}
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