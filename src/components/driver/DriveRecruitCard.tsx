// src/components/driver/DriveRecruitCard.tsx

import React from 'react';
import {
  MapPin,
  Calendar,
  Star,
  User,
  CircleDollarSign,
} from 'lucide-react';

/** ドライバー情報 */
export type DriverInfo = {
  name: string;
  rating: number;
  driveCount: number;
};

/** 募集ドライブ情報 */
export type DriveRecruit = {
  id: number;
  from: string;
  to: string;
  datetime: string;
  price: number;
  driver: DriverInfo;
};

type Props = {
  drive: DriveRecruit;
  onClick?: () => void;
};

export default function DriveRecruitCard({ drive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white rounded-2xl p-5 shadow-sm space-y-4
        hover:shadow-md transition cursor-pointer
      "
    >
      {/* ルート */}
      <div className="space-y-1 text-sm font-medium">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-green-600" />
          {drive.from}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-red-500" />
          {drive.to}
        </div>
      </div>

      {/* 日時・金額 */}
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Calendar size={16} />
        <span>{drive.datetime}</span>

        <span className="ml-auto flex items-center gap-1 font-bold text-green-600">
          <CircleDollarSign size={16} />
          {drive.price.toLocaleString()}
        </span>
      </div>

      {/* ドライバー情報 */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-3">
          {/* アイコン */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {drive.driver.name.charAt(0)}
          </div>

          <div>
            <p className="text-sm font-medium">
              {drive.driver.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <Star
                size={12}
                className="text-yellow-400 fill-yellow-400"
              />
              {drive.driver.rating}
              <span className="ml-1">
                ({drive.driver.driveCount}回)
              </span>
            </p>
          </div>
        </div>

        <User className="text-gray-400" />
      </div>
    </div>
  );
}
