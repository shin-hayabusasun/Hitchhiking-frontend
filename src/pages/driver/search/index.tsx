import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import { RecruitmentCard } from '@/components/driver/RecruitmentCard';
import { SearchFilters } from "../../_app"; 
import { Plus, Filter, MapPin, Search } from 'lucide-react';
import { getApiUrl } from '@/config/api';

type Props = {
  filter: SearchFilters;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
};

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecruitments = async () => {
    if (!filter) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/api/driver/search'), {
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
  };

  useEffect(() => {
    if(filter.departure || filter.destination) {
        fetchRecruitments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!filter) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    /* ★ 背景を w-full で全幅に広げ、中央寄せを適用 */
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-white flex justify-center w-full">
      
      {/* ★ コンテンツを max-w-2xl に制限。デザインを維持 */}
      <div className="w-full max-w-2xl min-h-screen bg-white flex flex-col font-sans relative shadow-2xl border-x border-gray-100">
        
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <DriverHeader title="募集検索" backPath="/"/>
        </div>

        <main className="flex-1 p-4 pb-24 scrollbar-hide overflow-y-auto">
          {/* タブメニュー（デザイン維持） */}
          <div className="grid grid-cols-4 gap-1 bg-gray-200/50 p-0.5 rounded-xl mb-4 backdrop-blur-sm">
              {tabs.map((tab) => {
                  const isActive = currentPath === tab.path;
                  return (
                      <button
                          key={tab.path}
                          type="button"
                          className={`py-1.5 text-[10px] font-bold rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={() => router.push(tab.path)}
                      >
                          {tab.name}
                      </button>
                  );
              })}
          </div>

          {/* 検索フォーム（デザイン維持） */}
          <div className="mb-5">
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-2.5">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="出発地" 
                  className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={filter.departure}
                  onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="目的地" 
                  className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={filter.destination}
                  onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={fetchRecruitments}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-transform text-sm"
                >
                  <Search className="w-4 h-4" /> 検索
                </button>
                <button onClick={() => router.push('/driver/search/filter')} className="w-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shadow-sm active:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 結果リスト */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-7 w-7 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500 text-xs font-bold">{error}</div>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <RecruitmentCard
                    key={req.id}
                    id={req.id}
                    passengerName={req.passengerName}
                    rating={req.rating}
                    reviewCount={req.reviewCount}
                    departure={req.start} 
                    destination={req.end}
                    budget={req.money}
                    date={req.date}
                    people={req.people}
                    matchingScore={req.match}
                    onClick={() => router.push(`/driver/search/${req.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-xs font-bold">
                <p>条件に合う募集は見つかりませんでした</p>
                <p className="text-[10px] font-normal mt-1">条件を変更して再度お試しください</p>
              </div>
            )}
          </div>
        </main>

        {/* ★ 下部固定ボタン（max-w-2xl 内に固定） */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent z-30">
          <button onClick={() => router.push('/driver/regist_drive')} className="w-full bg-green-600 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm">
            <Plus className="w-4 h-4" strokeWidth={3} /> 運転者として募集を作成
          </button>
        </div>
      </div>
    </div>
  );
}