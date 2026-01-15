import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  role: '自分' | '相手';
  message: string;
  time: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { chatid } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. データ取得ロジックを独立した関数にする ---
  const fetchChat = useCallback(async (isInitial: boolean = false) => {
    if (!chatid) return;
    
    try {
      if (isInitial) setLoading(true); // 初回だけローディングを表示

      const res = await fetch('/api/chat/getchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruitmentId: chatid }),
      });
      
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch chat:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [chatid]);

  // --- 2. useEffect で 10秒おきのタイマーを設定する ---
  useEffect(() => {
    if (!chatid) return;

    // 初回の取得
    fetchChat(true);

    // 10秒(10000ms)ごとに fetchChat を実行
    const timer = setInterval(() => {
      console.log("チャットを更新中...");
      fetchChat(false); // 2回目以降は裏側で更新
    }, 10000);

    // クリーンアップ関数: 画面を離れた時にタイマーを破棄する
    return () => clearInterval(timer);
  }, [chatid, fetchChat]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-bold text-gray-500">
      読み込み中...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[390px] bg-white flex flex-col shadow-xl h-screen relative">
        
        {/* ヘッダー */}
        <header className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">チャットルーム</h1>
        </header>

        {/* メッセージエリア */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa] scrollbar-hide">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              メッセージはまだありません
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === '自分' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.role === '相手' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-blue-500 font-bold border border-blue-200">
                      相手
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={`p-3 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                        msg.role === '自分'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className={`text-[9px] mt-1 text-gray-400 font-medium ${msg.role === '自分' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        {/* 入力フォーム */}
        <footer className="p-4 border-t bg-white flex gap-2 items-center">
          <input
            type="text"
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-90 transition-all shadow-md">
            <Send size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}