import React from 'react';
import { MapPin, Calendar, Star, Eye, MessageCircle, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';

interface MyRequestCardProps {
  item: any;
  // 'rejected' タブを追加
  tab: 'requesting' | 'approved' | 'completed' | 'rejected';
  onCancel: (id: number) => void;
  onDelete?: (id: number) => void; // 拒否された履歴を消す用（任意）
}

export const MyRequestCard: React.FC<MyRequestCardProps> = ({ item, tab, onCancel, onDelete }) => {
  const router = useRouter();

  const handleDetailClick = () => {
    const detailId = item.recruitmentId || item.id;
    alert("機能未実装: 詳細ページへ移動します");
  };

  const handleChatClick = (requestId: number) => () => {
    router.push(`/chat/${requestId}`);
  };

  const handleReviewClick = (requestId: number) => () => {
    router.push(`/hitch_hiker/review?recruitmentId=${requestId}`);
  }

  return (
    <div className={`bg-white rounded-[1.8rem] p-5 shadow-sm border border-white relative overflow-hidden transition-all active:scale-[0.98] ${tab === 'rejected' ? 'opacity-80' : ''}`}>
      
      {/* --- ステータスバッジ --- */}
      <div className="flex justify-between items-start mb-4">
        <div>
          {tab === 'requesting' && (
            <div className="flex items-center bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-yellow-100">
              <Clock className="w-3 h-3 mr-1" /> 承認待ち
            </div>
          )}
          {tab === 'approved' && (
            <div className="flex items-center bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-100">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 承認済み
            </div>
          )}
          {tab === 'completed' && (
            <div className="flex items-center bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-100">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 完了
            </div>
          )}
          {tab === 'rejected' && (
            <div className="flex items-center bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-100">
              <XCircle className="w-3 h-3 mr-1" /> 拒否されました
            </div>
          )}
        </div>
        <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
      </div>

      {/* --- ユーザー情報 --- */}
      <div className="flex items-center space-x-3 mb-5">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${tab === 'rejected' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
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

      {/* --- ルート情報 --- */}
      <div className="space-y-3 mb-5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
        <div className="flex items-center text-[13px] font-bold text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-green-500" /> {item.from}
        </div>
        <div className="flex items-center text-[13px] font-bold text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-red-500" /> {item.to}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
          <div className="flex items-center text-[11px] text-gray-400 font-bold">
            <Calendar className="w-4 h-4 mr-2" /> {item.time}
          </div>
          <div className={`font-black text-xl flex items-baseline ${tab === 'rejected' ? 'text-gray-400 line-through' : 'text-emerald-600'}`}>
            <span className="text-[12px] mr-0.5 font-bold">¥</span>{item.price}
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

        {tab === 'completed' && (
          <button onClick={handleReviewClick(item.id)} className="w-full py-3.5 rounded-xl bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg">
            <Star className="w-4 h-4 mr-2" /> レビューを書く
          </button>
        )}

        {tab === 'rejected' && (
           <button 
            onClick={() => onDelete && onDelete(item.id)}
            className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-500 text-[11px] font-bold flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-2" /> 履歴から削除
          </button>
        )}

        {(tab === 'requesting' || tab === 'approved') && (
          <div className="flex space-x-2">
            <button 
              onClick={() => onCancel(item.id)}
              className="flex-1 py-3.5 rounded-xl bg-white border border-red-100 text-[11px] font-bold text-red-400 hover:bg-red-50"
            >
              取り消し
            </button>
            <button onClick={handleChatClick(item.id)} className="flex-[2] py-3.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg">
              <MessageCircle className="w-4 h-4 mr-2" /> チャット
            </button>
          </div>
        )}
      </div>
    </div>
  );
};