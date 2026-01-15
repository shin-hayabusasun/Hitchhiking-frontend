import type { NextApiRequest, NextApiResponse } from 'next';

type ChatMessage = {
  role: '自分' | '相手';
  message: string;
  time: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { recruitmentId } = req.body;

  // 募集IDがない場合のエラー処理
  if (!recruitmentId) {
    return res.status(400).json({ message: '募集ID(recruitmentId)が必要です' });
  }

  // 時系列順の疑似データ
  // 実際はDBから recruitmentId に紐づくデータを取得する
  const mockHistory: ChatMessage[] = [
    { role: '自分', message: '本日はよろしくお願いします！', time: '10:00' },
    { role: '相手', message: 'こちらこそ！駅の北口でお待ちしています。', time: '10:02' },
    { role: '相手', message: '白いセダンで、ハザードを点けています。', time: '10:03' },
    { role: '自分', message: '承知しました。あと5分ほどで到着します。', time: '10:05' },
    { role: '相手', message: '了解です。お気をつけて！', time: '10:06' },
  ];

  // 成功レスポンス
  res.status(200).json({
    recruitmentId: recruitmentId,
    messages: mockHistory
  });
}