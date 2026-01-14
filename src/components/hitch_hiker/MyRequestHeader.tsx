import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

interface MyRequestHeaderProps {
  currentTab: 'requesting' | 'approved' | 'completed';
  onTabChange: (tab: 'requesting' | 'approved' | 'completed') => void;
}

export const MyRequestHeader: React.FC<MyRequestHeaderProps> = ({ currentTab, onTabChange }) => {
  const router = useRouter();
  
  const tabs = [
    { id: 'requesting', label: '申請中' },
    { id: 'approved', label: '承認済み' },
    { id: 'completed', label: '完了' },
  ] as const;

  return (
    <div className="bg-white sticky top-0 z-20">
      <div className="p-4 flex items-center pt-10 border-b border-gray-50">
        <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </button>
        <h1 className="text-lg font-bold text-gray-700 ml-4">マイリクエスト</h1>
      </div>

      <div className="px-5 py-4 bg-white">
        <div className="bg-[#E2E8F0] p-1 rounded-2xl flex">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => onTabChange(t.id)} 
              className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${
                currentTab === t.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};