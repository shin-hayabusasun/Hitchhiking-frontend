import { useEffect, useState } from 'react';
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(filter.departure || filter.destination) {
        fetchRecruitments();
    }
  }, []);

  if (!filter) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-[#00B049] border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    /* 全体背景：指定の薄グレー */
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* Header: 背景白・全幅 / 中身 max-w-2xl */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-2xl mx-auto w-full px-4 py-1">
            <DriverHeader title="募集検索" backPath="/"/>
          </div>
        </header>

        {/* Main Content: max-w-2xl / 白ベタ塗り / 両端ボーダー */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] max-w-2xl mx-auto w-full min-h-screen relative">
          <div className="p-5 space-y-4 pb-32">
            
            {/* 統一タブメニュー */}
            <div className="w-full grid grid-cols-4 gap-1 bg-gray-100/80 p-1 rounded-2xl mb-8 border border-gray-200/50">
              {tabs.map((tab) => {
                const isActive = currentPath === tab.path;
                return (
                  <button
                    key={tab.path}
                    type="button"
                    className={`py-3 text-[11px] font-black rounded-xl transition-all duration-300 ${
                      isActive 
                      ? 'bg-white text-gray-800 shadow-sm transform scale-[1.02]' 
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => router.push(tab.path)}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* 検索フォームエリア */}
            <div className="mb-8">
              <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100 space-y-3 shadow-inner">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00B049] w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="出発地を入力" 
                    className="w-full bg-white py-3.5 pl-11 pr-4 rounded-2xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B049]/10 focus:border-[#00B049]/30 transition-all"
                    value={filter.departure}
                    onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="目的地を入力" 
                    className="w-full bg-white py-3.5 pl-11 pr-4 rounded-2xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B049]/10 focus:border-[#00B049]/30 transition-all"
                    value={filter.destination}
                    onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={fetchRecruitments}
                    className="flex-1 bg-[#00B049] hover:bg-[#009940] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-100/50 active:scale-[0.98] transition-all text-sm"
                  >
                    <Search className="w-5 h-5" /> 検索する
                  </button>
                  <button onClick={() => router.push('/driver/search/filter')} className="w-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm active:bg-gray-50 transition-all">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 結果リスト */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-[#00B049] border-t-transparent rounded-full"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-rose-500 text-xs font-bold bg-rose-50 rounded-2xl border border-rose-100">{error}</div>
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
                <div className="w-full bg-gray-50 rounded-[2rem] py-20 px-6 text-center border border-gray-100">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Search className="text-gray-300" size={28} />
                  </div>
                  <p className="font-black text-gray-600">募集は見つかりませんでした</p>
                  <p className="text-[11px] font-bold mt-2 text-gray-400">条件を変えてもう一度お試しください</p>
                </div>
              )}
            </div>
          </div>

          {/* 下部固定ボタンエリア：デザイン維持 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-5 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
            <button 
              onClick={() => router.push('/driver/drives/create')} 
              className="w-full py-4 bg-[#00B049] hover:bg-[#009940] text-white rounded-2xl font-black shadow-xl shadow-emerald-100/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Plus size={22} strokeWidth={3} /> ドライブを作成
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}