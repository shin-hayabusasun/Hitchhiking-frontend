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
    /* 外枠（スマホ枠）は入れない！カードとしての背景と角丸だけを整える */
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-white/50">
      <div className="flex justify-between items-center mb-4">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${item.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
          {item.statusText}
        </span>
        <span className="text-[10px] font-bold text-gray-400">
          {item.status === 'MATCHED' ? `${item.partner}さんと成立` : `${item.applicantCount}件の申請`}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm font-bold text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}
        </div>
        <div className="flex items-center text-sm font-bold text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100/50 mt-2">
          <div className="flex items-center text-[10px] text-gray-500">
            <Calendar className="w-3 h-3 mr-1" /> {item.date}
          </div>
          <div className="flex items-center text-[10px] text-gray-500">
            <Users className="w-3 h-3 mr-1" /> {item.people}名
          </div>
          <div className="text-green-600 font-bold text-lg">
            ¥{item.price} <span className="text-[10px] text-gray-400 font-normal">/人</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {item.status === 'OPEN' ? (
          <>
            <button className="flex-1 border border-gray-200 py-3 rounded-2xl flex items-center justify-center text-xs font-bold text-gray-600">
              <Edit3 className="w-3 h-3 mr-1" /> 編集
            </button>
            <button className="flex-1 border border-red-100 py-3 rounded-2xl flex items-center justify-center text-xs font-bold text-red-500">
              <Trash2 className="w-3 h-3 mr-1" /> 削除
            </button>
          </>
        ) : (
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-all">
            <MessageCircle className="w-5 h-5 mr-2" /> チャットする
          </button>
        )}
      </div>
    </div>
  );
};

export default RecruitmentManagementCard;