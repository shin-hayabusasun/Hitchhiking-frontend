// % Start(AI Assistant)
import { useRouter } from 'next/router';
import { SearchFilters, TimeRange } from '../_app';
import { 
  LucideChevronLeft, 
  LucideMapPin, 
  LucideCalendar, 
  LucideUsers, 
  LucideClock, 
  LucideSearch,
  RotateCcw
} from 'lucide-react';

type Props = {
  filter: SearchFilters;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
};

export default function SearchFilterPage({ filter, setFilter }: Props) {
  const router = useRouter();

  // 1. リセット処理
  const handleReset = () => {
    setFilter({
      departure: '',
      destination: '',
      date: null,
      timeRange: { start: '00:00', end: '23:59' },
      priceRange: { min: null, max: null },
      seats: 1,
      conditions: {
        nonSmoking: null,
        petsAllowed: null,
        foodAllowed: null,
        musicAllowed: null,
      },
      isVerifiedOnly: null,
    });
  };

  // 2. 時間帯の個別更新
  const updateTimeRange = (key: 'start' | 'end', value: string) => {
    setFilter({
      ...filter,
      timeRange: {
        ...(filter.timeRange || { start: '00:00', end: '23:59' }),
        [key]: value
      }
    });
  };

  // 3. 時間帯プリセット設定
  const setTimePreset = (label: string) => {
    let range: TimeRange = { start: '00:00', end: '23:59' };
    if (label === '朝') range = { start: '05:00', end: '11:59' };
    if (label === '昼') range = { start: '12:00', end: '17:59' };
    if (label === '夜') range = { start: '18:00', end: '23:59' };
    setFilter({ ...filter, timeRange: range });
  };

  // 4. トグルスイッチコンポーネント
  const Switch = ({ checked, onChange }: { checked: boolean | null, onChange: (val: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-all relative duration-300 ease-in-out ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      
      {/* ヘッダー: 背景は全幅、中身は max-w-2xl 中央寄せ */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full shadow-sm">
        <div className="max-w-2xl mx-auto w-full px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 border border-gray-100"
          >
            <LucideChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-black text-gray-800">検索フィルター</h1>
          <button 
            onClick={handleReset} 
            className="flex items-center gap-1 text-sm font-black text-gray-400 hover:text-blue-600 transition-colors"
          >
            <RotateCcw size={14} />
            リセット
          </button>
        </div>
      </header>

      {/* メインコンテンツ: max-w-2xl */}
      <main className="max-w-2xl mx-auto w-full p-5 space-y-5 pb-40">
        
        {/* 場所セクション */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-4">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</h2>
          <div className="space-y-3">
            <div className="relative group">
              <LucideMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="出発地（例：東京駅）"
                className="w-full bg-gray-50 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                value={filter.departure}
                onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
              />
            </div>
            <div className="relative group">
              <LucideMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              <input
                type="text"
                placeholder="目的地（例：横浜駅）"
                className="w-full bg-gray-50 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                value={filter.destination}
                onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* 日時・時間帯セクション */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-5">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Schedule</h2>
          
          <div className="space-y-5">
            <div className="relative group">
              <LucideCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                className="w-full bg-gray-50 py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                value={filter.date || ''}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">時間帯を範囲で指定</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <LucideClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="time"
                    className="w-full bg-gray-50 py-3.5 pl-11 pr-2 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                    value={filter.timeRange?.start || '00:00'}
                    onChange={(e) => updateTimeRange('start', e.target.value)}
                  />
                </div>
                <span className="text-gray-300 font-black">〜</span>
                <div className="flex-1 relative">
                  <LucideClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="time"
                    className="w-full bg-gray-50 py-3.5 pl-11 pr-2 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                    value={filter.timeRange?.end || '23:59'}
                    onChange={(e) => updateTimeRange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['すべて', '朝', '昼', '夜'].map((label) => {
                const isActive = (label === 'すべて' && filter.timeRange?.start === '00:00' && filter.timeRange?.end === '23:59') ||
                               (label === '朝' && filter.timeRange?.start === '05:00') ||
                               (label === '昼' && filter.timeRange?.start === '12:00') ||
                               (label === '夜' && filter.timeRange?.start === '18:00');
                return (
                  <button
                    key={label}
                    onClick={() => setTimePreset(label)}
                    className={`py-3 rounded-2xl text-xs font-black border transition-all duration-300 ${
                      isActive ? 'bg-black text-white border-black shadow-lg' : 'bg-white border-gray-100 text-gray-500'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 料金範囲セクション */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</h2>
            <div className="text-blue-600 text-xs font-black bg-blue-50 px-4 py-1.5 rounded-full">
              ¥{filter.priceRange.min || 0} - ¥{filter.priceRange.max || 5000}
            </div>
          </div>
          <div className="px-2 py-4">
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
              value={filter.priceRange.max || 5000}
              onChange={(e) => setFilter({ ...filter, priceRange: { ...filter.priceRange, max: parseInt(e.target.value) } })}
            />
            <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-black">
              <span>¥0</span>
              <span>¥10,000+</span>
            </div>
          </div>
        </section>

        {/* 座席数セクション */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-4">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Seats</h2>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
              <LucideUsers size={20} />
            </div>
            <div className="flex gap-2 flex-1">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setFilter({ ...filter, seats: num })}
                  className={`flex-1 py-4 rounded-2xl text-sm font-black border transition-all duration-300 ${
                    filter.seats === num ? 'bg-black text-white border-black shadow-xl' : 'bg-white text-gray-500 border-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 車両条件セクション */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-4">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Conditions</h2>
          <div className="divide-y divide-gray-50">
            {[
              { label: '禁煙車のみ', key: 'nonSmoking', icon: '🚭' },
              { label: 'ペット可', key: 'petsAllowed', icon: '🐕' },
              { label: '飲食OK', key: 'foodAllowed', icon: '🍔' },
              { label: '音楽OK', key: 'musicAllowed', icon: '🎵' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-2xl text-xl">
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{item.label}</span>
                </div>
                <Switch 
                  checked={filter.conditions[item.key as keyof typeof filter.conditions]} 
                  onChange={(val) => setFilter({
                    ...filter,
                    conditions: { ...filter.conditions, [item.key]: val }
                  })}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 本人確認セクション */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl font-bold">
              ✓
            </div>
            <span className="text-sm font-bold text-gray-700">本人確認済みのみ</span>
          </div>
          <Switch 
            checked={filter.isVerifiedOnly} 
            onChange={(val) => setFilter({ ...filter, isVerifiedOnly: val })}
          />
        </section>
      </main>

      {/* 下部固定ボタン: 背景は全幅、ボタンは max-w-2xl */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50">
        <div className="max-w-2xl mx-auto w-full p-5">
          <button 
            onClick={() => router.back()}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-[1.5rem] shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-blue-700"
          >
            <LucideSearch size={20} className="stroke-[3px]" />
            この条件で検索
          </button>
        </div>
      </footer>

    </div>
  );
}
// % End