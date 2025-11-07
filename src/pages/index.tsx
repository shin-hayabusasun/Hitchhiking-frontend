import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic'

// ...existing code...

const Map = dynamic(
  () => import('../components/Map'),
  {
    loading: () => <p>地図を読み込み中...</p>,
    ssr: false // クライアントサイドのみでレンダリング
  }
)

type PositionData = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp: number;
};

export default function Home() {
  const [position, setPosition] = useState<PositionData | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      const getPos = () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!mounted) return;
            const p: PositionData = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy ?? null,
              timestamp: pos.timestamp,
            };
            setPosition(p);
            setGeoError(null);
            setGeoLoading(false);
          },
          (err) => {
            if (!mounted) return;
            setGeoError(err.message || "位置情報の取得に失敗しました");
            setGeoLoading(false);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
      };

      getPos();
      intervalId = window.setInterval(getPos, 5000);
    } else {
      setGeoError("Geolocation is not supported by this browser.");
      setGeoLoading(false);
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>リアルタイム位置情報</h1>
      <section style={{ marginTop: 20 }}>
        <h2>現在地 (5秒ごとに更新)</h2>
        {geoLoading && <p>位置情報を取得中...</p>}
        {geoError && <p style={{ color: "crimson" }}>{geoError}</p>}
        {position && (
          <div>
            <p>緯度: {position.latitude}</p>
            <p>経度: {position.longitude}</p>
            <p>誤差: {position.accuracy ?? "不明"} m</p>
            <p>取得時刻: {new Date(position.timestamp).toLocaleString()}</p>

            <div style={{ marginTop: 16, height: '400px' }}>
              <Map position={position} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}