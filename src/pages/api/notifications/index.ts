// % Start(Assistant)
// 通知一覧取得APIのモック
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const mockNotifications = [
			{
				id: 'notif1',
				type: 'request',
				title: '新しい申請がありました',
				message: '田中太郎さんからドライブへの申請がありました',
				timestamp: '2024-01-15 10:30',
				isRead: false,
				link: '/driver/requests',
			},
			{
				id: 'notif2',
				type: 'approval',
				title: '申請が承認されました',
				message: 'あなたの申請が承認されました',
				timestamp: '2024-01-14 15:20',
				isRead: false,
				link: '/hitch_hiker/MyRequest',
			},
			{
				id: 'notif3',
				type: 'message',
				title: '新しいメッセージ',
				message: '佐藤花子さんからメッセージが届きました',
				timestamp: '2024-01-13 09:15',
				isRead: true,
				link: '/messages',
			},
			{
				id: 'notif4',
				type: 'system',
				title: 'システムメンテナンスのお知らせ',
				message: '2024年1月20日にシステムメンテナンスを実施します',
				timestamp: '2024-01-10 08:00',
				isRead: true,
			},
			{
				id: 'notif5',
				type: 'request',
				title: 'ドライブ完了のお知らせ',
				message: 'ドライブが完了しました。レビューをお願いします',
				timestamp: '2024-01-08 18:45',
				isRead: true,
				link: '/hitch_hiker/review/d5',
			},
		];

		res.status(200).json({ success: true, data: mockNotifications });
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

