import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const mockRequests = [
            {
                id: 'req_001',
                passengerName: '高橋 美咲',
                rating: 4.7,
                reviewCount: 23,
                matchingRate: 92,
                departure: '渋谷駅',
                destination: '箱根',
                departureTime: '2025-11-08 07:00',
                createdAt: '2025-11-01T10:00:00Z',
            },
            {
                id: 'req_002',
                passengerName: '中村 健太',
                rating: 4.9,
                reviewCount: 45,
                matchingRate: 85,
                departure: '新宿駅',
                destination: '富士山',
                departureTime: '2025-11-09 08:30',
                createdAt: '2025-11-02T15:30:00Z',
            },
            {
                id: 'req_003',
                passengerName: '佐藤 健',
                rating: 4.2,
                reviewCount: 12,
                matchingRate: 78,
                departure: '池袋駅',
                destination: '秩父',
                departureTime: '2025-11-10 09:00',
                createdAt: '2025-11-03T12:00:00Z',
            }
        ];
        res.status(200).json({ requests: mockRequests });
    } else {
        res.status(405).end();
    }
}