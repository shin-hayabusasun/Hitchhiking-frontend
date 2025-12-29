import React from 'react';
import { MapPin, Calendar, Users, Eye, Edit3, Trash2 } from 'lucide-react';

interface RecruitmentItem {
  id: number;
  status: 'OPEN' | 'MATCHED';
  statusText: string;
  appliedDate: string;
  from: string;
  to: string;
  date: string;
  people: string;
  price: string;
  applicantCount: number;
}

const RecruitmentManagementCard = ({ item }: { item: RecruitmentItem }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white/50 mb-4">
      {/* カードヘッダー */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${item.status === 'OPEN' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
          <span className="text-[11px] font-bold text-gray-500">{item.statusText}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">申請日：{item.appliedDate}</span>
      </div>
      
      {/* ルート情報 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm font-bold text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}
        </div>
        <div className="flex items-center text-sm font-bold text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}
        </div>
        <div className="flex items-center text-[11px] text-gray-400 pt-1 border-t border-gray-50 mt-2">
          <Calendar className="w-3.5 h-3.5 mr-1" /> {item.date} 
          <Users className="w-3.5 h-3.5 ml-3 mr-1" /> {item.people}名
          <span className="ml-auto text-green-600 font-extrabold text-lg tracking-tighter">¥{item.price}</span>
        </div>
      </div>
      
      {/* ボタン群 */}
      <div className="space-y-2">
        <button className="w-full flex items-center justify-center py-2.5 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-500 bg-white hover:bg-gray-50">
          <Eye className="w-4 h-4 mr-2" /> 詳細を見る
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 py-3 rounded-xl bg-gray-100 text-[11px] font-bold text-gray-600 flex items-center justify-center active:scale-95 transition-all">
            <Edit3 className="w-4 h-4 mr-1" /> 編集
          </button>
          <button className="flex-1 py-3 rounded-xl bg-red-50 text-[11px] font-bold text-red-500 flex items-center justify-center active:scale-95 transition-all">
            <Trash2 className="w-4 h-4 mr-1" /> 削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentManagementCard;