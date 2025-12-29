import React from 'react';
import { MapPin, Calendar, Users, Eye, Edit3, Trash2, Star } from 'lucide-react';

const RecruitmentManagementCard = ({ item }: { item: any }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white mb-4 mx-1">
      {/* ヘッダー：ステータスと日付 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {/* 画像通りの薄い背景付きラベル */}
          <div className={`flex items-center px-3 py-1 rounded-lg text-[10px] font-bold ${
            item.status === 'OPEN' 
            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
            : 'bg-green-50 text-green-600 border border-green-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${item.status === 'OPEN' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
            {item.statusText}
          </div>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">申請日：{item.appliedDate}</span>
      </div>
      
      {/* ユーザー情報（画像にある場合） */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-inner text-sm">
          {item.userName ? item.userName[0] : '田'}
        </div>
        <div>
          <div className="font-extrabold text-[13px] text-gray-800">{item.userName || 'ユーザー名'}</div>
          <div className="flex items-center text-[10px] text-gray-400 font-bold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> 
            {item.rating || '4.8'} <span className="ml-1 opacity-70">({item.reviews || '0'}回)</span>
          </div>
        </div>
      </div>

      {/* ルート情報：アイコンの色を画像に合わせる */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-[13px] font-bold text-gray-700">
          <MapPin className="w-4 h-4 mr-3 text-green-500" /> {item.from}
        </div>
        <div className="flex items-center text-[13px] font-bold text-gray-700">
          <MapPin className="w-4 h-4 mr-3 text-red-500" /> {item.to}
        </div>
        <div className="flex items-center text-[11px] text-gray-400 pt-2 border-t border-gray-50 mt-2">
          <Calendar className="w-3.5 h-3.5 mr-1" /> {item.date} 
          <Users className="w-3.5 h-3.5 ml-3 mr-1" /> {item.people}名
          <span className="ml-auto text-[#059669] font-black text-xl">
            <span className="text-[14px] mr-0.5 font-bold">¥</span>{item.price}
          </span>
        </div>
      </div>
      
      {/* ボタン群：詳細ボタンを白、編集・削除をグレー/赤に */}
      <div className="space-y-2">
        <button className="w-full flex items-center justify-center py-2.5 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors">
          <Eye className="w-4 h-4 mr-2" /> 詳細を見る
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 py-3 rounded-xl bg-[#F1F5F9] text-[11px] font-bold text-gray-600 flex items-center justify-center active:scale-95 transition-all">
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