// src/pages/api/driver/schedules.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 実際のDB構造に基づいたモジュールデータ
    const mockData = {
      schedules: [
        {
          id: "2",
          createdAt: "2025-11-03",
          depName: "東京駅",
          arrName: "横浜駅",
          depTime: "2025-11-15 09:00",
          fare: 800,
          capacity: 2,
          status: "予定中"
        },
        {
          id: "3",
          createdAt: "2025-11-04",
          depName: "高知工科大学",
          arrName: "土佐山田駅",
          depTime: "2026-01-10 14:00",
          fare: 300,
          capacity: 3,
          status: "予定中"
        }
      ]
    };

    res.status(200).json(mockData);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}