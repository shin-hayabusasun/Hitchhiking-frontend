import React from 'react';
import { MapPin, Calendar, Users, MessageCircle, Edit3, Trash2 } from 'lucide-react';

interface RecruitmentManagementCardProps {
  item: {
    id: number;
    status: string;
    statusText: string;
    partner?: string;
    from: string;
    to: string;
    date: string;
    people: string;
    price: string;
    applicantCount: number;
  };
}

const RecruitmentManagementCard: React.FC<RecruitmentManagementCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === 'OPEN' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
          {item.statusText}
        </span>
        <span className="text-xs font-bold text-gray-400">
          {item.status === 'MATCHED' ? `${item.partner}さんと成立` : `${item.applicantCount}件の申請`}
        </span>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm font-bold text-gray-700"><MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}</div>
        <div className="flex items-center text-sm font-bold text-gray-700"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}</div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
          <div className="flex items-center text-xs text-gray-500"><Calendar className="w-4 h-4 mr-1" /> {item.date}</div>
          <div className="flex items-center text-xs text-gray-500"><Users className="w-4 h-4 mr-1" /> {item.people}名</div>
          <div className="text-green-600 font-bold text-lg">¥{item.price} <span className="text-[10px] text-gray-400 font-normal">/人</span></div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {item.status === 'OPEN' ? (
          <>
            <button className="flex-1 border border-gray-200 py-3 rounded-2xl flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"><Edit3 className="w-4 h-4 mr-2" /> 編集</button>
            <button className="flex-1 border border-red-100 py-3 rounded-2xl flex items-center justify-center font-bold text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4 mr-2" /> 削除</button>
          </>
        ) : (
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all">
            <MessageCircle className="w-5 h-5 mr-2" /> 運転者とチャットする
          </button>
        )}
      </div>
    </div>
  );
};

export default RecruitmentManagementCard;