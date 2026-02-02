import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import { SearchCard } from '@/components/hitch_hiker/SearchCard';
import { SearchFilters } from "../_app";
import { getApiUrl } from '@/config/api';
import { MapPin, Search, Filter, Plus, Loader2, Inbox } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <div className="text-[12px] text-gray-400 font-bold">読み込み中...</div>
      </div>
    );
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
        
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full">
            <HitchhikerHeader title="同乗者として利用" />
            
            {/* タブ切り替え */}
            <div className="flex px-4 py-2 gap-2 bg-white">
              <button className="flex-1 py-2 text-xs font-black text-blue-600 bg-blue-50/50 rounded-lg">
                募集検索
              </button>
              <button 
                onClick={handleManagementClick} 
                className="flex-1 py-2 text-xs font-black text-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center gap-1.5"
              >
                募集管理
                <span className="bg-gray-200 text-gray-500 text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">1</span>
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-4 pb-32">
            
            {/* 検索入力セクション */}
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-3">
              <div className="grid gap-2">
                {/* 出発地 */}
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="出発地を入力" 
                    className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300"
                    value={filter.departure}
                    onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                  />
                </div>

                {/* 目的地 */}
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="目的地を入力" 
                    className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300"
                    value={filter.destination}
                    onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={fetchRecruitments}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                  <Search className="w-3.5 h-3.5 stroke-[3px]" />
                  検索する
                </button>
                <button 
                  onClick={handleGofilter} 
                  className="w-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 検索結果リスト */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Searching...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-400 text-xs font-bold">{error}</div>
              ) : drives.length > 0 ? (
                <div className="grid gap-4">
                  {drives.map((drive) => (
                    <SearchCard key={drive.id} {...drive} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-center text-gray-200">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-black text-gray-400">該当する募集が見つかりません</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-1">Try changing filters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 下部固定ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto w-full p-5">
            <button 
              onClick={handleCreateClick} 
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              同乗者として募集を作成
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SearchPage;