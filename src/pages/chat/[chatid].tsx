import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface Message {
  role: '自分' | '相手';
  message: string;
  time: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { chatid } = router.query; // ここは applicationId（申請ID）として扱われます
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState(""); // ★追加: 入力テキストの状態
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false); // ★追加: 送信中の連打防止

  // --- データ取得ロジック ---
  const fetchChat = useCallback(async (isInitial: boolean = false) => {
    if (!chatid) return;
    try {
      if (isInitial) setLoading(true);
      const res = await fetch(getApiUrl('/api/chat/getchat'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: Number(chatid) }),
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

  // --- ★追加: メッセージ送信ロジック ---
  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatid || isSending) return;

    try {
      setIsSending(true);
      const res = await fetch(getApiUrl('/api/chat/sendmessage'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: Number(chatid),
          message: inputText,
        }),
      });

      if (res.ok) {
        setInputText(""); // 入力欄をクリア
        await fetchChat(false); // 即座にメッセージ一覧を更新
      } else {
        alert("送信に失敗しました");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // ポーリング設定
  useEffect(() => {
    if (!chatid) return;
    fetchChat(true);
    const timer = setInterval(() => fetchChat(false), 10000);
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
            value={inputText} // ★追加: ステータスと紐付け
            onChange={(e) => setInputText(e.target.value)} // ★追加
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // ★追加: Enterで送信
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isSending}
          />
          <button 
            onClick={handleSendMessage} // ★追加
            disabled={isSending || !inputText.trim()}
            className={`p-2 rounded-full active:scale-90 transition-all shadow-md ${
              inputText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500'
            }`}
          >
            <Send size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}