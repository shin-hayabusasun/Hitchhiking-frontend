'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface PointTransaction {
  id: string;
  type: string; // 'earned' | 'spent'
  amount: number;
  description: string;
  date: string;
}

export default function PointHistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Tabsコンポーネントが状態を持つため、filter stateはTabsのvalueと同期させます
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/point/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // credentials: 'include', // 必要に応じて有効化
        });
        
        // エラーハンドリングの強化
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      } catch (err) {
        setError('履歴の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // フィルタリングロジック
  const getFilteredTransactions = (tabValue: string) => {
    return transactions.filter((t) => {
      if (tabValue === 'all') return true;
      if (tabValue === 'earned') return t.type === 'earned';
      if (tabValue === 'spent') return t.type === 'spent';
      return true;
    });
  };

  // タイプに応じたバッジとアイコンのスタイル定義
  const getTypeStyles = (type: string) => {
    if (type === 'earned') {
      return {
        badge: "bg-green-100 text-green-700 border-0 hover:bg-green-100",
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        amountColor: "text-green-600",
        Icon: ArrowUpRight,
        label: "獲得"
      };
    } else {
      return {
        badge: "bg-red-100 text-red-700 border-0 hover:bg-red-100",
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
        amountColor: "text-red-600",
        Icon: ArrowDownLeft,
        label: "利用"
      };
    }
  };

  // トランザクションリストのレンダリング用コンポーネント
  const TransactionList = ({ items }: { items: PointTransaction[] }) => {
    if (items.length === 0) {
      return (
        <Card className="border-0 shadow-sm mt-4">
          <CardContent className="p-8 text-center">
            <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">履歴がありません</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3 mt-4">
        {items.map((t) => {
          const styles = getTypeStyles(t.type);
          const TypeIcon = styles.Icon;

          return (
            <Card key={t.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* アイコン */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
                    <TypeIcon className={`w-5 h-5 ${styles.iconColor}`} />
                  </div>
                  
                  {/* 詳細情報 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-800">{t.description}</p>
                      <Badge className={`${styles.badge} text-[10px] px-1.5 py-0`}>
                        {styles.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </div>
                </div>

                {/* ポイント数 */}
                <div className={`text-lg font-bold whitespace-nowrap ${styles.amountColor}`}>
                  {t.type === 'earned' ? '+' : '-'}
                  {t.amount.toLocaleString()} P
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">ポイント履歴</h1>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4">
        {/* エラー表示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* ローディング表示 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-500 text-sm">読み込み中...</p>
          </div>
        ) : (
          /* メインコンテンツ（タブとリスト） */
          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="earned">獲得</TabsTrigger>
              <TabsTrigger value="spent">利用</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TransactionList items={getFilteredTransactions('all')} />
            </TabsContent>
            <TabsContent value="earned">
              <TransactionList items={getFilteredTransactions('earned')} />
            </TabsContent>
            <TabsContent value="spent">
              <TransactionList items={getFilteredTransactions('spent')} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}