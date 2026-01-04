import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // すべてのデータ定義
    const allData = [
      {
        id: 1,
        name: '田中 太郎',
        rating: 4.8,
        reviews: 45,
        from: '東京駅',
        to: '横浜駅',
        date: '2025-11-03',
        time: '2025-11-05 09:00',
        price: 800,
        status: 'pending',
      },
      {
        id: 2,
        name: '佐藤 花子',
        rating: 4.9,
        reviews: 78,
        from: '渋谷駅',
        to: '新宿駅',
        date: '2025-11-03',
        time: '2025-11-06 14:30',
        price: 500,
        status: 'pending',
      },
      {
        id: 3,
        name: '鈴木 一郎',
        rating: 4.7,
        reviews: 32,
        from: '品川駅',
        to: '羽田空港',
        date: '2025-11-03',
        time: '2025-11-07 06:00',
        price: 1200,
        status: 'approved',
      },
      {
        id: 4,
        name: '高橋 美咲',
        rating: 4.8,
        reviews: 56,
        from: '新宿駅',
        to: '箱根',
        date: '2025-11-01',
        time: '2025-11-01 08:00',
        price: 2500,
        status: 'completed',
      },
    ];

    // ステータスごとに振り分けてレスポンスを作成
    const responseData = {
      requesting: allData.filter(item => item.status === 'pending'),
      approved: allData.filter(item => item.status === 'approved'),
      completed: allData.filter(item => item.status === 'completed'),
    };

    res.status(200).json({ 
      success: true, 
      data: responseData 
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}