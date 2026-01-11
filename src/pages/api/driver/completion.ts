// src/pages/api/driver/completion.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const mockData = {
      drives: [
        {
          id: "201",
          from_loc: "新宿駅",
          to_loc: "成田空港",
          datetime: "2025-11-05 10:00",
          price: 3000,
          driver: {
            name: "田中 次郎 (同乗者)",
            rating: 4.7,
            driveCount: 32,
          }
        },
        {
          id: "202",
          from_loc: "東京駅",
          to_loc: "軽井沢",
          datetime: "2025-10-28 07:00",
          price: 7000,
          driver: {
            name: "中村 健太 (運転者)",
            rating: 4.8,
            driveCount: 58,
          }
        }
      ]
    };
    res.status(200).json(mockData);
  } else {
    res.status(405).end();
  }
}