import { useRouter } from 'next/router';
import { SearchFilters, TimeRange } from '../_app';
import { 
  LucideChevronLeft, 
  LucideMapPin, 
  LucideCalendar, 
  LucideUsers, 
  LucideClock, 
  LucideSearch,
  CheckCircle2
} from 'lucide-react';

type Props = {
  filter: SearchFilters;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
};

export default function SearchFilterPage({ filter, setFilter }: Props) {
  const router = useRouter();

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

  const updateTimeRange = (key: 'start' | 'end', value: string) => {
    setFilter({
      ...filter,
      timeRange: {
        ...(filter.timeRange || { start: '00:00', end: '23:59' }),
        [key]: value
      }
    });
  };

  const setTimePreset = (label: string) => {
    let range: TimeRange = { start: '00:00', end: '23:59' };
    if (label === '朝') range = { start: '05:00', end: '11:59' };
    if (label === '昼') range = { start: '12:00', end: '17:59' };
    if (label === '夜') range = { start: '18:00', end: '23:59' };
    setFilter({ ...filter, timeRange: range });
  };

  const Switch = ({ checked, onChange }: { checked: boolean | null, onChange: (val: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors relative duration-200 ease-in-out ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <div className="w-full min-h-screen flex flex-col relative">
        
        {/* ヘッダーセクション */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto w-full px-4 py-3 pt-8 flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="p-1.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <LucideChevronLeft size={18} className="text-gray-400" />
            </button>
            <h1 className="text-sm font-black text-gray-800">検索フィルター</h1>
            <button 
              onClick={handleReset} 
              className="text-[11px] font-black text-gray-400 hover:text-red-400 transition-colors uppercase tracking-widest"
            >
              Reset
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto w-full p-4 space-y-4 pb-32">
            
            {/* 場所セクション */}
            <section className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-3">
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</h2>
              <div className="space-y-2">
                <div className="relative">
                  <LucideMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    placeholder="出発地（例：東京駅）"
                    className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                    value={filter.departure}
                    onChange={(e) => setFilter({ ...filter, departure: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <LucideMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                  <input
                    type="text"
                    placeholder="目的地（例：横浜駅）"
                    className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300 transition-all"
                    value={filter.destination}
                    onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* 日時・時間帯セクション */}
            <section className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Schedule</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <LucideCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="date"
                    className="w-full bg-gray-50 py-3 pl-10 pr-4 rounded-xl text-xs font-bold outline-none appearance-none focus:ring-2 focus:ring-blue-500/10"
                    value={filter.date || ''}
                    onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <LucideClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                      <input
                        type="time"
                        className="w-full bg-gray-50 py-2.5 pl-9 pr-2 rounded-xl text-xs font-bold outline-none border border-transparent focus:ring-2 focus:ring-blue-500/10 transition-all"
                        value={filter.timeRange?.start || '00:00'}
                        onChange={(e) => updateTimeRange('start', e.target.value)}
                      />
                    </div>
                    <span className="text-gray-200 font-bold text-xs">〜</span>
                    <div className="flex-1 relative">
                      <LucideClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                      <input
                        type="time"
                        className="w-full bg-gray-50 py-2.5 pl-9 pr-2 rounded-xl text-xs font-bold outline-none border border-transparent focus:ring-2 focus:ring-blue-500/10 transition-all"
                        value={filter.timeRange?.end || '23:59'}
                        onChange={(e) => updateTimeRange('end', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {['すべて', '朝', '昼', '夜'].map((label) => {
                      const isActive = (label === 'すべて' && filter.timeRange?.start === '00:00' && filter.timeRange?.end === '23:59') ||
                                     (label === '朝' && filter.timeRange?.start === '05:00') ||
                                     (label === '昼' && filter.timeRange?.start === '12:00') ||
                                     (label === '夜' && filter.timeRange?.start === '18:00');
                      return (
                        <button
                          key={label}
                          onClick={() => setTimePreset(label)}
                          className={`py-2 rounded-lg text-[10px] font-black transition-all duration-200 border ${
                            isActive ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-gray-100 text-gray-400'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 料金・座席セクション */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</h2>
                  <div className="text-blue-600 text-[10px] font-black bg-blue-50 px-2 py-0.5 rounded-lg">
                    ¥{filter.priceRange.min || 0} - ¥{filter.priceRange.max || 5000}
                  </div>
                </div>
                <div className="px-1 pt-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={filter.priceRange.max || 5000}
                    onChange={(e) => setFilter({ ...filter, priceRange: { ...filter.priceRange, max: parseInt(e.target.value) } })}
                  />
                </div>
              </section>

              <section className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-3">
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Seats</h2>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFilter({ ...filter, seats: num })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all duration-200 ${
                        filter.seats === num ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* 車両条件セクション */}
            <section className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-3">
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Conditions</h2>
              <div className="divide-y divide-gray-50">
                {[
                  { label: '禁煙車のみ', key: 'nonSmoking', icon: '🚭' },
                  { label: 'ペット可', key: 'petsAllowed', icon: '🐕' },
                  { label: '飲食OK', key: 'foodAllowed', icon: '🍔' },
                  { label: '音楽OK', key: 'musicAllowed', icon: '🎵' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-sm">
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.label}</span>
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
            <section className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-xl">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-xs font-bold text-gray-700">本人確認済みのみ</span>
              </div>
              <Switch 
                checked={filter.isVerifiedOnly} 
                onChange={(val) => setFilter({ ...filter, isVerifiedOnly: val })}
              />
            </section>
          </div>
        </main>

        {/* 下部固定検索ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <div className="max-w-2xl mx-auto w-full p-5">
            <button 
              onClick={() => router.back()}
              className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <LucideSearch size={16} className="stroke-[3px]" />
              この条件で検索
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}