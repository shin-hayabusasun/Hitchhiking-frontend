import React, { useEffect, useState } from "react";



type PositionData = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp: number;
};

export default function Home() {

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>五藤 branch作ってからpushのテスト</h1>
      
    </main>
  );
}