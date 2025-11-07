import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Leaflet の CSS は pages/_app.tsx で読み込むこと
// public に marker-icon.png / marker-shadow.png を置くこと

// マーカー画像の設定（標準サイズに戻す）
L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

type LatLng = {
  latitude: number;
  longitude: number;
}

type MapProps = {
  // 既存の single position と positions 配列の両方を受け取れるようにする
  position?: LatLng;
  positions?: LatLng[];
}

export default function Map({ position, positions }: MapProps) {
  const list: LatLng[] = positions ?? (position ? [position] : [])
  const center = list.length ? [list[0].latitude, list[0].longitude] : [0, 0]

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={list.length ? 15 : 2}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {list.map((p, i) => (
        <Marker key={`${p.latitude}-${p.longitude}-${i}`} position={[p.latitude, p.longitude]}>
          <Popup>
            現在地<br />
            緯度: {p.latitude}<br />
            経度: {p.longitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}