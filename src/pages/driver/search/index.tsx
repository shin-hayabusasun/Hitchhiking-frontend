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
  const [loading, setLoading] = useState(false); // 初期値は false に変更（初回は検索しない場合）
  const [error, setError] = useState('');

  // ★修正1: useCallback から [filter] 依存を外す必要はないが、呼び出すタイミングを制御する
  // 募集情報取得 (引数なしで現在の filter state を使う)
  const fetchRecruitments = async () => {
    if (!filter) return; // フィルターがなければ何もしない

    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/api/driver/search'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter: filter }), // その時点の filter を送信
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

  // ★修正2: useEffect を削除 (または初回のみ実行に変更)
  // 初回マウント時だけ検索したい場合は []、それ以外は手動実行のみにする
  useEffect(() => {
    // ページを開いた瞬間に1回だけ検索したいならこれを残す
    // ただし、フィルター画面から戻ってきた時などに検索したいならここを調整
    if(filter.departure || filter.destination) {
        fetchRecruitments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列を空にして、初回のみ実行にする

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
                  onClick={fetchRecruitments} // ★ここで明示的にAPIを呼ぶ
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