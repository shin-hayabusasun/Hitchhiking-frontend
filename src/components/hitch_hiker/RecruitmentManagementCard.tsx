import React from 'react';
import { MapPin, Calendar, Users, Eye, Edit3, Trash2 } from 'lucide-react';

const RecruitmentManagementCard = ({ item }: { item: any }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-5 shadow-sm border border-white/50 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${item.status === 'OPEN' ? 'bg-blue-400' : 'bg-green-500'}`}></span>
          <span className="text-[10px] font-bold text-gray-600">{item.statusText}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">{item.applicantCount}件の申請</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs font-bold text-gray-700"><MapPin className="w-4 h-4 mr-2 text-green-500" /> {item.from}</div>
        <div className="flex items-center text-xs font-bold text-gray-700"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {item.to}</div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <div className="flex items-center text-[10px] text-gray-500"><Calendar className="w-3 h-3 mr-1" /> {item.date}</div>
          <div className="flex items-center text-[10px] text-gray-500"><Users className="w-3 h-3 mr-1" /> {item.people}名</div>
          <div className="text-green-600 font-bold text-lg">¥{item.price}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <button className="w-full flex items-center justify-center py-2 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-500"><Eye className="w-4 h-4 mr-2" /> 詳細を見る</button>
        <div className="flex space-x-2">
          <button className="flex-1 py-3 rounded-xl bg-gray-100 text-[10px] font-bold text-gray-600 flex items-center justify-center"><Edit3 className="w-3 h-3 mr-1" /> 編集</button>
          <button className="flex-1 py-3 rounded-xl bg-red-50 text-[10px] font-bold text-red-500 flex items-center justify-center"><Trash2 className="w-3 h-3 mr-1" /> 削除</button>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentManagementCard;