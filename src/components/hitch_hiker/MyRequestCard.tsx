import React from 'react';
import { MapPin, Calendar, Star, Eye, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

import { useRouter } from 'next/router';


interface MyRequestCardProps {
  item: any;
  tab: 'requesting' | 'approved' | 'completed';

  onCancel: (id: number) => void;
}

export const MyRequestCard: React.FC<MyRequestCardProps> = ({ item, tab, onCancel }) => {
  const router = useRouter();

  // MyRequestCard.tsx の詳細ボタンの処理を以下に書き換えてください

const handleDetailClick = () => {
  // モックの 'rec1' や本番の 1 など、ある方のIDを使う
  const detailId = item.recruitmentId || item.id; 

  if (detailId) {
    // 【重要】フォルダ名「hitch_hiker_DriveDetail」と完全に一致させる
    router.push(`/hitch_hiker_DriveDetail/${detailId}`);
  } else {
    console.error("IDが見つかりません", item);
  }
};

  return (
    <div className="bg-white rounded-[1.8rem] p-5 shadow-sm border border-white relative overflow-hidden transition-all active:scale-[0.98]">
      {/* --- ステータス・ユーザー・ルート情報の表示は今のままでOK --- */}

      <div className="flex justify-between items-start mb-4">
        <div>
          {tab === 'requesting' ? (
            <div className="flex items-center bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-100">
              <Clock className="w-3 h-3 mr-1" /> 承認待ち
            </div>
          ) : (
            <div className="flex items-center bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-100">
              <CheckCircle2 className="w-3 h-3 mr-1" /> {tab === 'approved' ? '承認済み' : '完了'}
            </div>
          )}
        </div>
=
        <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
      </div>

      <div className="flex items-center space-x-3 mb-5">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
          {item.name ? item.name[0] : "U"}

        </div>
        <div>
          <div className="font-extrabold text-[15px] text-gray-800">{item.name}</div>
          <div className="flex items-center text-[11px] text-gray-400 font-bold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> {item.rating} 
            <span className="ml-1 opacity-70">({item.reviews}回)</span>
          </div>
        </div>
      </div>


      <div className="space-y-3 mb-5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
        <div className="flex items-center text-[13px] font-bold text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-green-500" /> {item.from_loc || item.origin}
        </div>
        <div className="flex items-center text-[13px] font-bold text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-red-500" /> {item.to_loc || item.destination}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
          <div className="flex items-center text-[11px] text-gray-400 font-bold">
            <Calendar className="w-4 h-4 mr-2" /> {item.time}
          </div>
          <div className="text-emerald-600 font-black text-xl flex items-baseline">
            <span className="text-[12px] mr-0.5 font-bold">¥</span>{item.price || item.fee}

          </div>
        </div>
      </div>


      {/* --- ボタンエリア --- */}
      <div className="space-y-2">
        <button 
          onClick={handleDetailClick}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-500 flex items-center justify-center bg-white hover:bg-gray-50"
        >
          <Eye className="w-4 h-4 mr-2" /> 詳細を見る
        </button>

        {tab === 'completed' ? (
          <button className="w-full py-3.5 rounded-xl bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg">

            <Star className="w-4 h-4 mr-2" /> レビューを書く
          </button>
        ) : (
          <div className="flex space-x-2">

            <button 
              onClick={() => onCancel(item.id)}
              className="flex-1 py-3.5 rounded-xl bg-white border border-red-100 text-[11px] font-bold text-red-400 hover:bg-red-50"
            >
              取り消し
            </button>
            <button className="flex-[2] py-3.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg">

              <MessageCircle className="w-4 h-4 mr-2" /> チャット
            </button>
          </div>
        )}
      </div>
    </div>
  );
};