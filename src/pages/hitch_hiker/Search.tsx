import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import { SearchCard } from '@/components/hitch_hiker/SearchCard';
import { SearchFilters } from "../_app"; 
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
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;
  }
  const router = useRouter();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecruitments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/hitchhiker/boshukensaku'), {
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* Header: 背景白・全幅 / 中身 max-w-2xl */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-2xl mx-auto w-full px-4 py-1">
            <HitchhikerHeader title="同乗者として利用" />
          </div>
        </header>

        {/* Main Content: max-w-2xl で中央寄せ */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 pt-4 pb-32">
          
          {/* タブ切り替え */}
          <div className="flex py-4 gap-2">
            <button className="flex-1 bg-white py-3 rounded-2xl shadow-sm border border-blue-100 text-blue-600 font-black text-sm">
              募集検索
            </button>
            <button onClick={handleManagementClick} className="flex-1 bg-gray-200/50 py-3 rounded-2xl text-gray-500 font-bold text-sm flex items-center justify-center gap-2">
              募集管理
              <span className="bg-blue-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">1</span>
            </button>
          </div>

          {/* 検索入力セクション */}
          <section className="mb-8">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-4">
              {/* 出発地 */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="出発地を入力" 
                  className="w-full bg-gray-50 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  value={filter.departure}
                  onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                />
              </div>

              {/* 目的地 */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="目的地を入力" 
                  className="w-full bg-gray-50 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                  value={filter.destination}
                  onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button 
                  onClick={fetchRecruitments}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  検索する
                </button>
                <button onClick={handleGofilter} className="w-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                </button>
              </div>
            </div>
          </section>

          {/* 検索結果リスト */}
          <section className="space-y-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400 font-bold">読み込み中...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 px-6 bg-red-50 rounded-3xl text-red-500 font-bold">{error}</div>
            ) : drives.length > 0 ? (
              <div className="grid gap-4">
                {drives.map((drive) => (
                  <SearchCard key={drive.id} {...drive} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 font-bold">
                該当する募集が見つかりません
              </div>
            )}
          </section>

          {/* 下部固定アクションエリア */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-40">
            <button onClick={handleCreateClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
              <span className="text-2xl leading-none">+</span>
              同乗者として募集を作成
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default SearchPage;