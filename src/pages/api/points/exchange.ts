// % Start(AI Assistant)
// モックAPI: ポイント交換実行

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { productId } = req.body;

	if (!productId) {
		return res.status(400).json({
			message: '商品IDが指定されていません',
		});
	}

	// モック処理: 実際にはポイント残高チェックと減算が必要
	return res.status(200).json({
		message: '交換が完了しました',
		orderId: `order-${Date.now()}`,
	});
}

// % End

