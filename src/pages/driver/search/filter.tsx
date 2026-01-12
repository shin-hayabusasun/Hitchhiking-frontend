import { useRouter } from 'next/router';
import { SearchFilters, TimeRange } from '../../../_app';
import { LucideChevronLeft, LucideMapPin, LucideCalendar, LucideUsers, LucideClock, LucideSearch } from 'lucide-react';

type Props = {
  filter: SearchFilters;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
};

export default function DriverSearchFilterPage({ filter, setFilter }: Props) {
  const router = useRouter();

  const handleReset = () => {
    setFilter({
      departure: '', destination: '', date: null,
      timeRange: { start: '00:00', end: '23:59' },
      priceRange: { min: null, max: null },
      seats: 1,
      isVerifiedOnly: null,
      // conditions は削除済
    });
  };

  const updateTimeRange = (key: 'start' | 'end', value: string) => {
    setFilter({
      ...filter,
      timeRange: { ...(filter.timeRange || { start: '00:00', end: '23:59' }), [key]: value }
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
    <button onClick={() => onChange(!checked)} className={`w-12 h-6 rounded-full transition-colors relative duration-200 ease-in-out ${checked ? 'bg-green-600' : 'bg-gray-300'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans max-w-[390px] mx-auto shadow-xl border-x overflow-x-hidden">
      <header className="flex items-center justify-between px-4 py-4 bg-white sticky top-0 z-20 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 border border-gray-100 rounded-xl shadow-sm"><LucideChevronLeft size={20} className="text-gray-600" /></button>
        <h1 className="text-lg font-bold text-gray-800">条件絞り込み</h1>
        <button onClick={handleReset} className="text-sm font-bold text-gray-400">リセット</button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        <section className="bg-white p-5 rounded-[2rem] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-800">場所</h2>
          <div className="space-y-3">
            <div className="relative">
              <LucideMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" placeholder="出発地" className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-green-500" value={filter.departure} onChange={(e) => setFilter({ ...filter, departure: e.target.value })} />
            </div>
            <div className="relative">
              <LucideMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
              <input type="text" placeholder="目的地" className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-green-500" value={filter.destination} onChange={(e) => setFilter({ ...filter, destination: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-[2rem] shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-gray-800">日時</h2>
          <div className="space-y-4">
            <div className="relative">
              <LucideCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="date" className="w-full bg-gray-50 py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none" value={filter.date || ''} onChange={(e) => setFilter({ ...filter, date: e.target.value })} />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">時間帯</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <LucideClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="time" className="w-full bg-gray-50 py-2.5 pl-9 pr-2 rounded-xl text-sm outline-none" value={filter.timeRange?.start || '00:00'} onChange={(e) => updateTimeRange('start', e.target.value)} />
                </div>
                <span className="text-gray-300 font-bold">〜</span>
                <div className="flex-1 relative">
                  <LucideClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="time" className="w-full bg-gray-50 py-2.5 pl-9 pr-2 rounded-xl text-sm outline-none" value={filter.timeRange?.end || '23:59'} onChange={(e) => updateTimeRange('end', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['すべて', '朝', '昼', '夜'].map((label) => (
                <button key={label} onClick={() => setTimePreset(label)} className={`py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${((label === 'すべて' && filter.timeRange?.start === '00:00' && filter.timeRange?.end === '23:59') || (label === '朝' && filter.timeRange?.start === '05:00') || (label === '昼' && filter.timeRange?.start === '12:00') || (label === '夜' && filter.timeRange?.start === '18:00')) ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-800'}`}>{label}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-[2rem] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800">最低希望金額</h2>
            <div className="text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full">¥{filter.priceRange.min || 0} 以上</div>
          </div>
          <div className="px-2 py-4">
            <input type="range" min="0" max="10000" step="500" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600" value={filter.priceRange.min || 0} onChange={(e) => setFilter({ ...filter, priceRange: { ...filter.priceRange, min: parseInt(e.target.value) } })} />
          </div>
        </section>

        <section className="bg-white p-5 rounded-[2rem] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-800">人数（以下）</h2>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><LucideUsers size={20} /></div>
            <div className="flex gap-2 flex-1">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} onClick={() => setFilter({ ...filter, seats: num })} className={`flex-1 py-3.5 rounded-xl text-sm font-bold border transition-all duration-200 ${filter.seats === num ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-100'}`}>{num}人</button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-5 rounded-[2rem] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-full font-bold">✓</div>
            <span className="text-sm font-bold text-gray-700">本人確認済みのみ</span>
          </div>
          <Switch checked={filter.isVerifiedOnly} onChange={(val) => setFilter({ ...filter, isVerifiedOnly: val })} />
        </section>
      </main>

      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[390px] mx-auto z-30">
        <button onClick={() => router.back()} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"><LucideSearch size={20} /> この条件で検索</button>
      </div>
    </div>
  );
}
