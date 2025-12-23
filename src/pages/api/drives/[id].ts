// % Start(Assistant)
// ドライブ詳細取得APIのモック
// API仕様: GET /api/drives/{id}
// % End

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const { id } = req.query;

		// モックドライブ詳細データ
		const mockDriveDetail = {
			drive: {
				id: id,
				driverId: 'driver123',
				driverName: '山田太郎',
				driverProfile: {
					rating: 4.8,
					reviewCount: 124,
					verificationStatus: 'verified',
				},
				departure: '東京駅',
				destination: '大阪駅',
				departureTime: '2024-02-01T10:00:00',
				capacity: 4,
				currentPassengers: 2,
				fee: 5000,
				message: 'よろしくお願いします。高速道路を利用して快適にドライブします。',
				vehicleRules: {
					noSmoking: true,
					petAllowed: false,
					musicAllowed: true,
				},
				status: 'active',
			},
		};

		res.status(200).json(mockDriveDetail);
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

