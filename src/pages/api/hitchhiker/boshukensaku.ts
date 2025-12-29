// % Start(AI Assistant)
// モックAPI: 募集検索 (配列を直接返す形に修正)

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const mockDrives = [
        {
            id: '1',
            name: '田中 太郎',
            start: '東京駅',
            end: '横浜駅',
            date: '2025-11-05 09:00',
            money: 800,
            people: 2,
            match: 95,
            carinfo: 'トヨタ プリウス',
            state: '募集中',
            car_jouken: [
                { jouken_name: '禁煙' },
                { jouken_name: 'ペット不可' },
                { jouken_name: '音楽OK' }
            ],
        },
        {
            id: '2',
            name: '佐藤 花子',
            start: '新宿駅',
            end: '八王子駅',
            date: '2025-11-06 18:30',
            money: 1200,
            people: 3,
            match: 88,
            carinfo: 'ホンダ N-BOX',
            state: '募集中',
            car_jouken: [
                { jouken_name: '禁煙' },
                { jouken_name: '女性限定' }
            ],
        },
        {
            id: '3',
            name: '鈴木 一郎',
            start: '品川駅',
            end: '静岡駅',
            date: '2025-11-10 07:00',
            money: 3500,
            people: 4,
            match: 72,
            carinfo: '日産 セレナ',
            state: '残りわずか',
            car_jouken: [
                { jouken_name: '飲食可' },
                { jouken_name: '荷物多めOK' }
            ],
        },
    ];

    // 配列をそのままレスポンスとして返却
    return res.status(200).json(mockDrives);
}

// % End

// % End