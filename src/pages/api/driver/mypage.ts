// src/pages/api/driver/mypage.ts
import type { NextApiRequest, NextApiResponse } from "next";

/*
  フロント側が期待しているレスポンス構造に完全一致させたモックAPI
*/

let mockProfile = {
  name: "黒星 朋来",
  initial: "K",
  driveCount: 42,
  rating: 4.8,
  registeredAt: "2024/04/01",

  car: {
    model: "トヨタ プリウス",
    color: "ホワイト",
    year: 2020,
    number: "品川 300 あ 12-34",
  },

  rules: {
    smoking: true,
    pet: false,
    food: true,
    music: true,
  },

  introduction: "安全運転を心がけています。楽しくドライブしましょう！",
  hobby: "ドライブ、写真撮影",
  purpose: "通勤・週末のお出かけ",

  license: {
    number: "1234567890",
    expire: "2027-03-31",
    verified: true,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* ======================
     GET：マイページ取得
  ====================== */
  if (req.method === "GET") {
    return res.status(200).json(mockProfile);
  }

  /* ======================
     PUT：マイページ編集保存
  ====================== */
  if (req.method === "PUT") {
    const {
      name,
      introduction,
      hobby,
      purpose,
      carModel,
      carColor,
      carYear,
      carNumber,
      rules,
    } = req.body;

    // フロント編集画面の state と対応
    mockProfile = {
      ...mockProfile,
      name,
      introduction,
      hobby,
      purpose,
      car: {
        model: carModel,
        color: carColor,
        year: Number(carYear),
        number: carNumber,
      },
      rules: {
        smoking: rules.smoke,
        pet: rules.pet,
        food: rules.food,
        music: rules.music,
      },
      initial: name?.charAt(0) ?? "K",
    };

    console.log("=== Driver mypage updated ===");
    console.log(mockProfile);

    return res.status(200).json({
      ok: true,
      message: "プロフィールを更新しました",
    });
  }

  /* ======================
     その他のメソッド
  ====================== */
  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ message: "Method Not Allowed" });
}
