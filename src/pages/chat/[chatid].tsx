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
  const { chatid } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

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

  // --- メッセージ送信ロジック ---
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
        setInputText("");
        await fetchChat(false);
      } else {
        alert("送信に失敗しました");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!chatid) return;
    fetchChat(true);
    const timer = setInterval(() => fetchChat(false), 10000);
    return () => clearInterval(timer);
  }, [chatid, fetchChat]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-400">
      <div className="animate-pulse">読み込み中...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* ★ ヘッダー: 白背景は横いっぱい、中身は max-w-2xl */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <h1 className="font-black text-lg text-gray-800 tracking-tight">チャットルーム</h1>
        </div>
      </header>

      {/* ★ メインコンテンツ: max-w-2xl で中央寄せ */}
      <div className="flex-1 w-full max-w-2xl flex flex-col bg-white shadow-sm ring-1 ring-black/5">
        
        {/* メッセージエリア */}
        <main className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#F9FAFB] scrollbar-hide min-h-0">
          {messages.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-xs font-bold tracking-widest uppercase">
              No messages yet
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === '自分' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.role === '相手' && (
                    <div className="w-9 h-9 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 font-black border border-gray-100 shadow-sm">
                      相手
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] shadow-sm leading-relaxed font-medium ${
                        msg.role === '自分'
                          ? 'text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}
                      style={msg.role === '自分' ? { backgroundColor: '#00B049' } : {}}
                    >
                      {msg.message}
                    </div>
                    <span className={`text-[9px] mt-1.5 text-gray-400 font-bold tracking-tighter ${msg.role === '自分' ? 'text-right mr-1' : 'text-left ml-1'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        {/* 入力フォーム */}
        <footer className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#00B049] outline-none transition-all placeholder:text-gray-400 font-medium"
              disabled={isSending}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isSending || !inputText.trim()}
              className={`p-3 rounded-2xl active:scale-90 transition-all shadow-lg flex items-center justify-center ${
                inputText.trim() ? 'text-white hover:opacity-90' : 'bg-gray-100 text-gray-300'
              }`}
              style={inputText.trim() ? { backgroundColor: '#00B049' } : {}}
            >
              <Send size={20} strokeWidth={2.5} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}