// % Start(田所櫂人)
import React from 'react';

// 設計書の入力項目に基づいた型定義
interface RecruitmentCardProps {
    state: string;           // 募集状態
    start: string;           // 出発地
    end: string;             // 目的地
    date: string;            // 日付
    money: number;           // 料金
    people: number;          // 人数
    registrationdate: string; // 登録日
    onEdit: () => void;      // 編集ボタン
    onDelete: () => void;    // 削除ボタン
}

const RecruitmentManagementCard: React.FC<RecruitmentCardProps> = (props) => {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
            <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-1 rounded">
                    {props.state}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">登録日: {props.registrationdate}</span>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12 font-bold">経路</span>
                    <span className="text-sm font-bold text-slate-700">{props.start} → {props.end}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12 font-bold">日時</span>
                    <span className="text-sm text-slate-600 font-medium">{props.date}</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-12 font-bold">料金</span>
                        <span className="text-sm text-slate-600 font-bold">{props.money.toLocaleString()}円</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-12 font-bold">人数</span>
                        <span className="text-sm text-slate-600 font-medium">{props.people}人</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 border-t border-slate-50 pt-4 mt-2">
                <button 
                    onClick={props.onEdit} 
                    className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                    編集
                </button>
                <button 
                    onClick={props.onDelete} 
                    className="flex-1 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                >
                    削除
                </button>
            </div>
        </div>
    );
};

export default RecruitmentManagementCard;
// % End