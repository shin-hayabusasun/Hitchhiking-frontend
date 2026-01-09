import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';

/** タブの種別定義 */
export type DriveTabType = 'scheduled' | 'in_progress' | 'completed';

interface DriveManagementHeaderProps {
  /** ヘッダータイトル (デフォルト: ドライブ管理) */
  title?: string;
  /** 現在選択されているタブ */
  activeTab: DriveTabType;
  /** タブが切り替わった時のコールバック関数 */
  onTabChange: (tab: DriveTabType) => void;
  /** 戻るボタンの遷移先 (指定がない場合は router.back()) */
  backPath?: string;
}

/**
 * ドライブ管理ヘッダーコンポーネント
 * * 戻るボタン、タイトル、ステータス切り替えタブのみで構成
 * * 内部設計書 4.1.5 (募集管理) 等のUIとして使用
 */
export function DriveManagementHeader({
  title = 'ドライブ管理',
  activeTab,
  onTabChange,
  backPath,
}: DriveManagementHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  // タブの定義データ
  const tabs: { id: DriveTabType; label: string }[] = [
    { id: 'scheduled', label: '予定中' },
    { id: 'in_progress', label: '進行中' },
    { id: 'completed', label: '完了' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* 上段：戻るボタンとタイトル */}
      <div className="relative flex items-center justify-center h-14 px-4">
        {/* 左側：戻るボタン (絶対配置で左寄せ) */}
        <button
          type="button"
          onClick={handleBackClick}
          className="absolute left-4 p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>

        {/* 中央：タイトル */}
        <h1 className="text-lg font-bold text-gray-800">
          {title}
        </h1>
      </div>

      {/* 下段：3つのタブ */}
      <div className="flex w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors relative
                ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab.label}
              
              {/* アクティブ時の下線 */}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}