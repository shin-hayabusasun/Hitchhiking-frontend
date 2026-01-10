import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const mockCustomers = [
    {
      id: '1',
      name: '山田 太郎',
      email: 'yamada@example.com',
      points: 450,
      orderCount: 3,
      rideCount: 12,
      registeredAt: '2024-01-15',
    },
    {
      id: '2',
      name: '佐藤 花子',
      email: 'sato@example.com',
      points: 820,
      orderCount: 5,
      rideCount: 23,
      registeredAt: '2024-02-20',
    },
    {
      id: '3',
      name: '鈴木 一郎',
      email: 'suzuki@example.com',
      points: 0,
      orderCount: 0,
      rideCount: 1,
      registeredAt: '2024-03-10',
    }
  ];

  return res.status(200).json({ customers: mockCustomers });
}