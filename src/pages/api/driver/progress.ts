// src/pages/api/driver/progress.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 進行中のドライブデータ（モック）
    const mockData = {
      drives: [
        {
          id: "101",
          from: "渋谷駅",
          to: "品川駅",
          datetime: "2026-01-15 08:30",
          price: 1200,
          driver: {
            name: "山田 太郎",
            rating: 4.8,
            driveCount: 45,
          }
        }
      ]
    };
    res.status(200).json(mockData);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}