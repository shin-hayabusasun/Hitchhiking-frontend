import type { NextApiRequest, NextApiResponse } from 'next';

// レスポンスの型定義
type HitchhikerMypageData = {
  bio: string;
  ride_count: number;
  rating: number;
  reg_date: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HitchhikerMypageData | { error: string }>
) {
  // POSTメソッドのみを許可
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // モックデータ
  // 実際にはここで Cookie 等からユーザーを特定し、DBから取得する処理が入ります
  const mockData: HitchhikerMypageData = {
    bio: "こんにちは！安全運転でヒッチハイカーを目的地まで送り届けます。趣味はドライブと旅行です。",
    ride_count: 15,
    rating: 4.8,
    reg_date: "2024-01-15",
  };

  // 常にモックデータを返す
  res.status(200).json(mockData);
}