// src/components/hitch_hiker/cards/RecruitmentManagementCard.tsx

import React from 'react';

interface RecruitmentCardProps {
    state: string;
    start: string;
    end: string;
    date: string;
    money: number;
    people: number;
    registrationdate: string;
    onEdit: () => void;
    onDelete: () => void;
}

// const で定義
const RecruitmentManagementCard: React.FC<RecruitmentCardProps> = (props) => {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
            {/* ...中身（前回の回答と同じ）... */}
        </div>
    );
};

// 最後に default export
export default RecruitmentManagementCard;