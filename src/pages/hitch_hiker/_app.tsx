// pages/_app.tsx
import { useState } from "react";
import type { AppProps } from "next/app";

export type TimeRange = {
  start: string;
  end: string;
};

// 型名を SearchFilters に統一
export type SearchFilters = {
  departure: string;
  destination: string;
  date: string | null;
  timeRange: TimeRange | null;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  seats: number;
  conditions: {
    nonSmoking: boolean | null;
    petsAllowed: boolean | null;
    foodAllowed: boolean | null;
    musicAllowed: boolean | null;
  };
  isVerifiedOnly: boolean | null;
};

export default function App({ Component, pageProps }: AppProps) {
  // ステートを作成
  const [filter, setFilter] = useState<SearchFilters>({
    departure: '',
    destination: '',
    date: null,
    timeRange: {
      start: '00:00',
      end: '23:59',
    },
    priceRange: {
      min: null,
      max: null,
    },
    seats: 1,
    conditions: {
      nonSmoking: null,
      petsAllowed: null,
      foodAllowed: null,
      musicAllowed: null,
    },
    isVerifiedOnly: null,
  });

  return (
    <Component
      {...pageProps}
      // プロパティ名を filter / setFilter に修正
      filter={filter}
      setFilter={setFilter}
    />
  );
}

