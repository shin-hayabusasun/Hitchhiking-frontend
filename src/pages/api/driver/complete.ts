import type { NextApiRequest, NextApiResponse } from "next";

/**
 * ドライブ完了 API（モック）
 * 本来は DB のステータスを「完了」に更新する
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST 以外は拒否
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      ok: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { driveId } = req.body;

    // デバッグ表示（サーバーターミナルに出る）
    console.log("=== ドライブ完了 ===");
    console.log("driveId:", driveId);
    console.log("===================");

    // モックなので常に成功
    return res.status(200).json({
      ok: true,
      message: "ドライブを完了しました",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "ドライブ完了処理に失敗しました",
    });
  }
}
