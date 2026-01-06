import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  ok: boolean;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // POSTメソッド以外はエラーを返す
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, message: `Method ${req.method} Not Allowed` });
  }

  // リクエストパラメータ（body）から bio を取得
  const { bio } = req.body;

  // デバッグ用にコンソールに表示（サーバー側のターミナルに表示されます）
  console.log("--- Profile Update Request ---");
  console.log("New Bio:", bio);
  console.log("------------------------------");

  // モックなので常に成功を返す
  res.status(200).json({ ok: true });
}