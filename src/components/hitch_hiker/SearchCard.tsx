// % Start(AI Assistant)
// 募集検索カードコンポーネント: 検索結果を表示するカード

import { useRouter } from 'next/router';

type caritem = {
	jouken_name: string;
};
interface SearchCardProps {
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

export function SearchCard({
	id,
	name,
	start,
	end,
	date,
	money,
	people,
	match,
	carinfo,
	state,
	car_jouken
}: SearchCardProps)  {
	const router = useRouter();

	function handleDetailClick() {
		router.push(`/hitch_hiker/DriveDetail/${id}`);
	}

	

	return (
		<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 w-full max-w-sm font-sans">
      {/* 上部：マッチ度と評価 */}
      <div className="flex justify-between items-center mb-4">
        {match !== undefined && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            マッチング度 {match}%
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <span className="text-yellow-400">★</span>
          <span className="font-bold text-gray-700">4.8</span>
          <span className="text-gray-400">(45回)</span>
        </div>
      </div>

      {/* プロフィール情報 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="text-gray-800 font-bold text-base leading-tight">{name}</h3>
          <p className="text-gray-400 text-xs mt-1">{carinfo}</p>
        </div>
      </div>

      {/* ルート情報 */}
      <div className="space-y-4 mb-6 relative">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0" />
          <div>
            <p className="text-gray-400 text-[10px]">出発地</p>
            <p className="text-gray-800 font-bold text-sm">{start}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0" />
          <div>
            <p className="text-gray-400 text-[10px]">目的地</p>
            <p className="text-gray-800 font-bold text-sm">{end}</p>
          </div>
        </div>
      </div>

      {/* 日時・料金・定員 */}
      <div className="flex items-center justify-between text-gray-500 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs font-medium">{date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-green-500 font-bold">$</span>
          <span className="text-green-500 font-bold text-sm">¥{money.toLocaleString()}</span>
          
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-xs font-medium">{people}名まで</span>
        </div>
      </div>

      {/* ステータスバッジ */}
      <div className="mb-4">
        <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-lg">
          {state}
        </span>
      </div>

      {/* 車両条件タグ */}
      <div className="flex flex-wrap gap-2 mb-6">
        {car_jouken.map((item) => (
          <span key={item.id} className="bg-gray-50 text-gray-600 text-[10px] px-3 py-1 rounded-md border border-gray-100">
            {item.name}
          </span>
        ))}
      </div>

      {/* 詳細を見るボタン */}
      <button onClick={() => handleDetailClick(id)} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-100 active:scale-[0.98] transition-transform text-sm">
        詳細を見る
      </button>
    </div>
	);
}

// % End

