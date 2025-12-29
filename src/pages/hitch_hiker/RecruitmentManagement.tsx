// ...import部分はそのまま...

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col border-[8px] border-white relative ring-1 ring-gray-200 bg-[#E0F2FE] overflow-hidden rounded-[3rem]">
        
        <div className="bg-white p-4 flex items-center justify-between pt-10 sticky top-0 z-20">
          <button onClick={() => router.back()} className="text-gray-500"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="text-lg font-bold text-gray-700">同乗者として利用</h1>
          <div className="flex space-x-3 text-gray-400">
            <Search className="w-6 h-6" />
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* ヘッダータブ */}
        <div className="px-4 py-2 bg-white flex space-x-2">
          <button className="flex-1 py-2 text-sm font-bold text-gray-400">募集検索</button>
          <button className="flex-1 py-2 text-sm font-bold text-gray-700 bg-[#F1F5F9] rounded-xl relative">
            募集管理 <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2563EB] text-white text-[10px] rounded-full flex items-center justify-center">1</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scrollbar-hide">
          {recruitments.map((item: any) => (
            <RecruitmentManagementCard key={item.id} item={item} />
          ))}
        </div>

        {/* 画面最下部の固定ボタン */}
        <div className="absolute bottom-6 w-full px-6 z-40">
          <button className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-all">
            <Plus className="w-5 h-5 mr-2" /> 新しい募集を作成
          </button>
        </div>
      </div>
    </div>
  );
// ...