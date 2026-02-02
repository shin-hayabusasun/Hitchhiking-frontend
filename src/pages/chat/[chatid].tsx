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
    <div className="min-h-screen bg-white">
      {/* 全体の最大幅を max-w-3xl に制限して中央寄せ */}
      <div className="max-w-3xl mx-auto w-full h-screen flex flex-col relative overflow-hidden border-x border-gray-100">
        
        {/* ヘッダー: パディングとフォントサイズを微調整 (p-5, text-xl) */}
        <header className="p-5 border-b flex items-center gap-5 bg-white sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={26} />
          </button>
          <h1 className="font-bold text-xl tracking-tight text-gray-800">チャットルーム</h1>
        </header>

        {/* メッセージエリア: 余白を広めに確保 (p-6, space-y-6) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa] scrollbar-hide">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              メッセージはまだありません
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === '自分' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-3 max-w-[85%]">
                  {msg.role === '相手' && (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] text-blue-600 font-black border border-blue-200 shadow-sm">
                      相手
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={`p-4 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                        msg.role === '自分'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className={`text-[10px] mt-1.5 text-gray-400 font-semibold tracking-wide ${msg.role === '自分' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        {/* 入力フォーム: 高さ、余白、フォントをサイズアップ (p-5, py-3, text-base) */}
        <footer className="p-5 border-t bg-white flex gap-3 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
            disabled={isSending}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isSending || !inputText.trim()}
            className={`p-3 rounded-full active:scale-95 transition-all shadow-md ${
              inputText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500'
            }`}
          >
            <Send size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}