import React, { useState } from "react";

type LatLng = [number, number];

type SearchResult = {
  prof: string;
  "p-start": LatLng;
  "p-dist": LatLng;
  match: number;
};

export default function Sarch({ onResults }: { onResults?: (r: SearchResult[]) => void }) {
  const [startText, setStartText] = useState("35.6895,139.6917"); // デフォルト: 東京
  const [distText, setDistText] = useState("35.6812,139.7671");
  const [player, setPlayer] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseLatLng = (s: string): LatLng | null => {
    const parts = s.split(",").map(p => p.trim());
    if (parts.length !== 2) return null;
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    return null;
  };

  const handleSearch = async () => {
    setError(null);
    const start = parseLatLng(startText);
    const dist = parseLatLng(distText);
    if (!start || !dist) {
      setError("緯度,経度は「lat,lng」の形式で入力してください");
      return;
    }

    const payload = {
      start,
      dist,
      player,
      include: "include" // 要求仕様に合わせたフィールド。fetchではcredentialsも指定します
    };

    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SearchResult[];
      setResults(json);
      onResults?.(json);
    } catch (e: any) {
      setError(e.message || "検索に失敗しました");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ marginBottom: 20 }}>
      <h3>出発地・目的地を入力</h3>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", minWidth: 260 }}>
          出発地 (lat,lng)
          <input value={startText} onChange={e => setStartText(e.target.value)} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", minWidth: 260 }}>
          目的地 (lat,lng)
          <input value={distText} onChange={e => setDistText(e.target.value)} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", width: 120 }}>
          player
          <select value={player} onChange={e => setPlayer(Number(e.target.value) as 1 | 2)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>

        <div style={{ alignSelf: "end" }}>
          <button onClick={handleSearch} disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "検索中..." : "検索"}
          </button>
        </div>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {results && results.length > 0 && (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {results.map((r, idx) => (
            <article
              key={`${r.prof}-${idx}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                background: "#fff"
              }}
            >
              <h4 style={{ margin: "0 0 8px 0" }}>{r.prof || `候補 ${idx + 1}`}</h4>
              <p style={{ margin: 0 }}>
                match: <strong>{r.match}</strong>
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 13 }}>
                p-start: [{r["p-start"][0]}, {r["p-start"][1]}] <br />
                p-dist: [{r["p-dist"][0]}, {r["p-dist"][1]}]
              </p>
            </article>
          ))}
        </div>
      )}

      {results && results.length === 0 && <p>該当する候補はありませんでした。</p>}
    </section>
  );
}