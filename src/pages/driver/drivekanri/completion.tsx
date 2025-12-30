import { useRouter } from 'next/router';

export default function CompletionPage() {
  const router = useRouter();

  const tabs = [
    { label: '予定中', path: '/driver/drivekanri/schedule' },
    { label: '進行中', path: '/driver/drivekanri/progress' },
    { label: '完了', path: '/driver/drivekanri/completion' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-lg font-bold">ドライブ管理</h1>

        {/* タブ */}
        <div className="flex rounded-xl bg-white shadow-sm overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`flex-1 py-2 text-sm font-bold ${
                router.pathname === tab.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 完了履歴 */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="font-bold">秋葉原 → 上野</p>
            <p className="text-sm text-gray-500">2024/12/28 完了</p>
          </div>
        </div>
      </div>
    </div>
  );
}
