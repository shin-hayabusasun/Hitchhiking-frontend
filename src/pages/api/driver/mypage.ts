// src/pages/api/driver/mypage.ts
import type { NextApiRequest, NextApiResponse } from "next";

/*
   趣味、目的、およびライセンス情報を削除したモックデータ
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
      carModel,
      carColor,
      carYear,
      carNumber,
      rules,
    } = req.body;

    // 内部データの更新（licenseを排除）
    mockProfile = {
      ...mockProfile,
      name: name ?? mockProfile.name,
      introduction: introduction ?? mockProfile.introduction,
      car: {
        model: carModel ?? mockProfile.car.model,
        color: carColor ?? mockProfile.car.color,
        year: carYear ? Number(carYear) : mockProfile.car.year,
        number: carNumber ?? mockProfile.car.number,
      },
      rules: rules ? {
        smoking: rules.smoke,
        pet: rules.pet,
        food: rules.food,
        music: rules.music,
      } : mockProfile.rules,
      initial: name?.charAt(0) ?? mockProfile.initial,
    };

    console.log("=== Driver mypage updated (License removed) ===");
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