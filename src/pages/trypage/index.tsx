'use client';

import React from 'react';

// ==========================================
// 1. 共通ユーティリティ & UIコンポーネント
// ==========================================

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// --- Button コンポーネント ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'icon' | 'sm' | 'lg';
}

const Button = ({ 
  className, 
  variant = 'default', 
  size = 'default', 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    outline: "border border-slate-200 hover:bg-slate-50",
  };
  
  const sizes = {
    default: "h-11 py-2 px-4",
    sm: "h-9 px-3 rounded-lg",
    lg: "h-12 px-8 rounded-xl",
    icon: "h-10 w-10 rounded-full", // アイコンボタンは丸くする
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props} 
    />
  );
};

// --- Card コンポーネント ---
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn("rounded-2xl border border-slate-100 bg-white text-slate-950 shadow-sm transition-shadow hover:shadow-md", className)} 
    {...props} 
  />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5", className)} {...props} />
);

// ==========================================
// 2. アイコン (SVG)
// ==========================================

const IconBase = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

const ArrowLeft = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>
);
const Users = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>
);
const Package = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></IconBase>
);
const ShoppingCart = ({ className }: { className?: string }) => (
  <IconBase className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></IconBase>
);
const TrendingUp = ({ className }: { className?: string }) => (
  <IconBase className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></IconBase>
);
const BarChart3 = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></IconBase>
);
const LogOut = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></IconBase>
);
const ChevronRight = ({ className }: { className?: string }) => (
  <IconBase className={className}><path d="m9 18 6-6-6-6"/></IconBase>
);

// ==========================================
// 3. メインページ (Default Export)
// ==========================================

export default function Page() {
  const onNavigate = (page: string) => {
    console.log(`Navigating to: ${page}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 font-sans text-slate-900">
      
      {/* --- ヘッダーエリア --- */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/60">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('home')}
                className="-ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">ダッシュボード</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('logout-complete')}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* --- 統計サマリー (グリッド) --- */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-slate-500">本日の概況</h2>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">Updated now</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 顧客数 */}
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
              <CardContent className="p-5 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium mb-1">総顧客数</p>
                    <p className="text-3xl font-bold">1,234</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
              {/* 装飾用の円 */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            </Card>

            {/* 注文数 */}
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +12%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">156</p>
                <p className="text-xs text-slate-500 font-medium">総注文数</p>
              </CardContent>
            </Card>

            {/* 商品数 */}
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800">24</p>
                <p className="text-xs text-slate-500 font-medium">取扱商品</p>
              </CardContent>
            </Card>

            {/* ポイント */}
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800">45k</p>
                <p className="text-xs text-slate-500 font-medium">発行ポイント</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- 管理メニュー (リストスタイル) --- */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1">管理メニュー</h2>
          <Card className="overflow-hidden border-slate-200/60 shadow-sm">
            <div className="divide-y divide-slate-100">
              {[
                { label: '顧客管理', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', link: 'admin-customers' },
                { label: '商品管理', icon: Package, color: 'text-violet-500', bg: 'bg-violet-50', link: 'admin-products' },
                { label: '在庫管理', icon: BarChart3, color: 'text-rose-500', bg: 'bg-rose-50', link: 'admin-inventory' },
                { label: '注文管理', icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-50', link: 'admin-orders' },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.link)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", item.bg)}>
                      <item.icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* --- 最近のアクティビティ (タイムライン風) --- */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1">最近のアクティビティ</h2>
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="p-0">
              <div className="relative">
                {/* タイムラインの縦線 */}
                <div className="absolute left-[2.25rem] top-6 bottom-6 w-px bg-slate-100"></div>

                <div className="space-y-0">
                  {[
                    { title: '新規会員登録', desc: '山田太郎さんが登録しました', time: '5分前', icon: Users, color: 'bg-blue-500' },
                    { title: '新規注文', desc: 'ギフト券の注文 (¥5,000)', time: '12分前', icon: ShoppingCart, color: 'bg-emerald-500' },
                    { title: '在庫アラート', desc: 'エコバッグの在庫残少 (残り3個)', time: '1時間前', icon: Package, color: 'bg-rose-500' },
                  ].map((item, i) => (
                    <div key={i} className="relative flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                      <div className={cn("relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ring-4 ring-white", item.color)}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-800">{item.title}</p>
                          <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 border-t border-slate-100 text-center">
                <button 
                  onClick={() => onNavigate('activity-log')}
                  className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors py-2 w-full"
                >
                  すべてのアクティビティを見る
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}