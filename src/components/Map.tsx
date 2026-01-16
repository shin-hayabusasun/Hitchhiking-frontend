import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'

// Leaflet の CSS は pages/_app.tsx で読み込むこと
// public に marker-icon.png / marker-shadow.png を置くこと

// カスタムアイコンを作成
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
}

// マーカーの色定義
const greenIcon = createCustomIcon('#10B981')  // ドライバー出発地
const redIcon = createCustomIcon('#EF4444')    // ドライバー目的地
const blueIcon = createCustomIcon('#3B82F6')   // 自分の出発地
const purpleIcon = createCustomIcon('#A855F7') // 自分の目的地

export type MarkerData = {
  latitude: number;
  longitude: number;
  label: string;
  type: 'driver-departure' | 'driver-destination' | 'my-departure' | 'my-destination';
}

type LatLng = {
  latitude: number;
  longitude: number;
}

type MapProps = {
  // 既存の single position と positions 配列の両方を受け取れるようにする
  position?: LatLng;
  positions?: LatLng[];
  // 新しいマーカーデータ配列
  markers?: MarkerData[];
}

export default function Map({ position, positions, markers }: MapProps) {
  // 下位互換性のために既存のpositions配列も処理
  const list: LatLng[] = positions ?? (position ? [position] : [])
  
  // マーカーがある場合はその中心を計算、なければlist[0]を使用
  const center = markers && markers.length 
    ? [markers[0].latitude, markers[0].longitude]
    : (list.length ? [list[0].latitude, list[0].longitude] : [35.6812, 139.7671]) // デフォルト: 東京

  // ズームレベルの計算（全てのマーカーが見えるように）
  const zoom = markers && markers.length > 1 ? 12 : 15

  // アイコンを取得する関数
  const getIcon = (type: string) => {
    switch (type) {
      case 'driver-departure': return greenIcon
      case 'driver-destination': return redIcon
      case 'my-departure': return blueIcon
      case 'my-destination': return purpleIcon
      default: return greenIcon
    }
  }

  // ルート線を描画するための座標配列
  const driverRoute = markers?.filter(m => m.type.startsWith('driver-')).map(m => [m.latitude, m.longitude] as [number, number])
  const myRoute = markers?.filter(m => m.type.startsWith('my-')).map(m => [m.latitude, m.longitude] as [number, number])

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* ドライバーのルート線 */}
      {driverRoute && driverRoute.length === 2 && (
        <Polyline positions={driverRoute} color="#10B981" weight={3} opacity={0.6} />
      )}
      
      {/* 自分のルート線 */}
      {myRoute && myRoute.length === 2 && (
        <Polyline positions={myRoute} color="#3B82F6" weight={3} opacity={0.6} dashArray="10, 10" />
      )}
      
      {/* 新しいマーカー表示 */}
      {markers?.map((marker, i) => (
        <Marker 
          key={`marker-${i}`} 
          position={[marker.latitude, marker.longitude]}
          icon={getIcon(marker.type)}
        >
          <Popup>
            <strong>{marker.label}</strong><br />
            緯度: {marker.latitude.toFixed(5)}<br />
            経度: {marker.longitude.toFixed(5)}
          </Popup>
        </Marker>
      ))}
      
      {/* 下位互換性のための既存マーカー */}
      {!markers && list.map((p, i) => (
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