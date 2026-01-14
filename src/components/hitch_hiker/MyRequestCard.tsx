import React from 'react';
import { MapPin, Calendar, Star, Eye, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

interface MyRequestCardProps {
  item: any;
  tab: 'requesting' | 'approved' | 'completed';
}

export const MyRequestCard: React.FC<MyRequestCardProps> = ({ item, tab }) => {
  return (
    <div className="bg-white rounded-[1.8rem] p-5 shadow-sm border border-white relative overflow-hidden">
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
        <span className="text-[10px] text-gray-400 font-medium">申請日: {item.date}</span>
      </div>

      <div className="flex items-center space-x-3 mb-5">
        <div className="w-12 h-12 bg-[#E0EDFF] rounded-full flex items-center justify-center font-bold text-[#3B82F6] text-lg">
          {item.name[0]}
        </div>
        <div>
          <div className="font-extrabold text-[15px] text-gray-800">{item.name}</div>
          <div className="flex items-center text-[11px] text-gray-400 font-bold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> {item.rating} 
            <span className="ml-1 opacity-70">({item.reviews}回)</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5 bg-gray-50/50 p-3 rounded-2xl">
        <div className="flex items-center text-[13px] font-bold text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-green-500" /> {item.from}
        </div>
        <div className="flex items-center text-[13px] font-bold text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-red-500" /> {item.to}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-[11px] text-gray-400 font-bold">
            <Calendar className="w-4 h-4 mr-2" /> {item.time}
          </div>
          <div className="text-[#059669] font-black text-xl flex items-baseline">
            <span className="text-[12px] mr-0.5 font-bold">¥</span>{item.price}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full py-2.5 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500 flex items-center justify-center bg-white">
          <Eye className="w-4 h-4 mr-2" /> 詳細を見る
        </button>
        {tab === 'completed' ? (
          <button className="w-full py-3.5 rounded-xl bg-[#D97706] text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-orange-100 active:scale-95 transition-all">
            <Star className="w-4 h-4 mr-2" /> レビューを書く
          </button>
        ) : (
          <div className="flex space-x-2">
            <button className="flex-1 py-3.5 rounded-xl bg-white border border-gray-100 text-[11px] font-bold text-gray-400">取り消し</button>
            <button className="flex-[2] py-3.5 rounded-xl bg-[#2563EB] text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all">
              <MessageCircle className="w-4 h-4 mr-2" /> チャット
            </button>
          </div>
        )}
      </div>
    </div>
  );
};