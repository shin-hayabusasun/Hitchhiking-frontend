// % Start(小松暉)
// ドライブ詳細画面: 運転者が作成した特定のドライブ募集の詳細情報を表示する

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DriverHeader } from '@/components/driver/DriverHeader';
import {
	ArrowLeft, MapPin, Calendar, Clock, Users,
	DollarSign, Car, Check, Music, Dog, Utensils, Edit
} from 'lucide-react';

interface DriveDetail {
	id: string;
	driverId: string;
	driverName: string;
	departure: string;
	destination: string;
	departureTime: string;
	capacity: number;
	currentPassengers: number;
	fee: number;
	message?: string;
	vehicleRules?: {
		noSmoking?: boolean;
		petAllowed?: boolean;
		musicAllowed?: boolean;
		foodAllowed: false,
	};
	status: string;
	passengers?: Array<{
		id: string;
		name: string;
		status: string;
	}>;
}

export function DriverDriveDetailPage() {
	const router = useRouter();
	const { id } = router.query;
	const [drive, setDrive] = useState<DriveDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// URLパラメータからidを取得し、ドライブ詳細を取得
	useEffect(() => {
		if (!id) {
			return;
		}

		async function fetchDriveDetail() {
			try {
				const response = await fetch(`/api/drives/${id}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				});
				const data = await response.json();

				if (response.ok && data.drive) {
					setDrive(data.drive);
				} else {
					setError('ドライブ情報の取得に失敗しました');
				}
			} catch (err) {
				setError('ドライブ情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchDriveDetail();
	}, [id]);

	function handleBackClick() {
		router.push('/driver/drives');
	}

	function handleEditClick() {
		router.push(`/driver/drives/edit/${id}`);
	}

	if (loading) {
		return (
			<div className="driver-drive-detail-page">
				<DriverHeader />
				<div className="loading-container">
					<div className="loading-spinner"></div>
					<p>読み込み中...</p>
				</div>
			</div>
		);
	}

	if (error || !drive) {
		return (
			<div className="driver-drive-detail-page">
				<DriverHeader />
				<div className="error-container">
					<p>{error || 'ドライブ情報が見つかりません'}</p>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleBackClick}
					>
						戻る
					</button>
				</div>
			</div>
		);
	}

	const formattedDate = new Date(drive.departureTime).toLocaleString(
		'ja-JP',
		{
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		}
	);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[390px] aspect-[9/19] shadow-2xl flex flex-col font-sans border-[8px] border-white relative ring-1 ring-gray-200 bg-gradient-to-b from-sky-200 to-white overflow-y-auto">
				{/* <DriverHeader /> */}
				<div className="bg-white shadow-sm sticky top-0 z-20 p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button onClick={() => router.push('/driver/drives')} className="text-gray-600 p-1">
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-green-600 font-bold text-lg">詳細</h1>
					</div>
				</div>

				{/* <div className="drive-detail-container">
					<div className="detail-header">
						<h1>ドライブ詳細</h1>
						<div className="status-badge">
							{drive.status === 'active' && (
								<span className="badge badge-success">募集中</span>
							)}
							{drive.status === 'scheduled' && (
								<span className="badge badge-info">予定</span>
							)}
							{drive.status === 'in_progress' && (
								<span className="badge badge-warning">進行中</span>
							)}
							{drive.status === 'completed' && (
								<span className="badge badge-secondary">完了</span>
							)}
						</div>
					</div>

					<div className="drive-info-section">
						<h2>ルート情報</h2>
						<div className="info-grid">
							<div className="info-item">
								<span className="info-label">出発地</span>
								<span className="info-value">{drive.departure}</span>
							</div>
							<div className="info-item">
								<span className="info-label">目的地</span>
								<span className="info-value">{drive.destination}</span>
							</div>
							<div className="info-item">
								<span className="info-label">出発時刻</span>
								<span className="info-value">{formattedDate}</span>
							</div>
							<div className="info-item">
								<span className="info-label">料金</span>
								<span className="info-value">
									¥{drive.fee.toLocaleString()}
								</span>
							</div>
							<div className="info-item">
								<span className="info-label">定員</span>
								<span className="info-value">
									{drive.currentPassengers} / {drive.capacity}名
								</span>
							</div>
						</div>
					</div>

					{drive.vehicleRules && (
						<div className="vehicle-rules-section">
							<h2>車両ルール</h2>
							<div className="rules-list">
								{drive.vehicleRules.noSmoking && (
									<div className="rule-item">
										<span className="icon">🚭</span>
										<span>禁煙</span>
									</div>
								)}
								{drive.vehicleRules.petAllowed && (
									<div className="rule-item">
										<span className="icon">🐕</span>
										<span>ペット可</span>
									</div>
								)}
								{drive.vehicleRules.musicAllowed && (
									<div className="rule-item">
										<span className="icon">🎵</span>
										<span>音楽可</span>
									</div>
								)}
							</div>
						</div>
					)}

					{drive.message && (
						<div className="message-section">
							<h2>メッセージ</h2>
							<p className="message-content">{drive.message}</p>
						</div>
					)}

					{drive.passengers && drive.passengers.length > 0 && (
						<div className="passengers-section">
							<h2>同乗者リスト</h2>
							<div className="passengers-list">
								{drive.passengers.map((passenger) => {
									return (
										<div key={passenger.id} className="passenger-card">
											<div className="passenger-info">
												<span className="passenger-name">
													{passenger.name}
												</span>
												<span
													className={`passenger-status status-${passenger.status}`}
												>
													{passenger.status === 'approved'
														? '承認済み'
														: passenger.status === 'pending'
															? '承認待ち'
															: passenger.status}
												</span>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					<div className="action-buttons">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleBackClick}
						>
							戻る
						</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleEditClick}
						>
							編集する
						</button>
					</div>
				</div>
			</div>
		</div>
	); */}
				<main className="flex-1 p-4 space-y-4 pb-24">
					{/* ルート情報 */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<div className="flex justify-between items-center">
							<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ルート情報</p>
							<span className={`text-[10px] px-2 py-1 rounded-full font-bold ${drive.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
								{drive.status === 'active' ? '募集中' : '完了'}
							</span>
						</div>
						<div className="space-y-3">
							<div className="flex items-start gap-3 text-sm">
								<MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
								<div><p className="text-gray-500 text-[10px]">出発地</p><p className="font-bold">{drive.departure}</p></div>
							</div>
							<div className="flex items-start gap-3 text-sm">
								<MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
								<div><p className="text-gray-500 text-[10px]">目的地</p><p className="font-bold">{drive.destination}</p></div>
							</div>
						</div>
					</div>

					{/* 日時 */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">出発日時</p>
						<div className="flex gap-6 text-sm">
							<div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><b>{formattedDate.split(' ')[0]}</b></div>
							<div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><b>{formattedDate.split(' ')[1]}</b></div>
						</div>
					</div>

					{/* 詳細設定 */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">詳細設定</p>
						<div className="grid grid-cols-2 gap-3">
							<div className="flex items-center gap-3 text-sm">
								<Users className="w-4 h-4 text-gray-400" />
								<div><p className="text-gray-500 text-[10px]">定員</p><b>{drive.currentPassengers} / {drive.capacity}名</b></div>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<DollarSign className="w-4 h-4 text-green-600" />
								<div><p className="text-gray-500 text-[10px]">料金/人</p><b className="text-green-600">¥{drive.fee.toLocaleString()}</b></div>
							</div>
						</div>
					</div>

					{/* 車両ルール */}
					<div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">車両ルール</p>
						<div className="grid grid-cols-2 gap-y-3">
							<RuleIcon icon={<Car size={14} />} label="禁煙" active={drive.vehicleRules?.noSmoking} />
							<RuleIcon icon={<Dog size={14} />} label="ペット可" active={drive.vehicleRules?.petAllowed} />
							<RuleIcon icon={<Utensils size={14} />} label="飲食OK" active={drive.vehicleRules?.musicAllowed} /> {/* 作成画面と同期 */}
							<RuleIcon icon={<Music size={14} />} label="音楽OK" active={drive.vehicleRules?.musicAllowed} />
						</div>
					</div>

					{/* メッセージ */}
					{drive.message && (
						<div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
							<p className="text-xs font-bold text-gray-400 uppercase tracking-wider">メッセージ</p>
							<p className="text-sm text-gray-700 leading-relaxed">{drive.message}</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

// 共通パーツ
function RuleIcon({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
	return (
		<div className={`flex items-center gap-2 text-xs ${active ? 'text-gray-800' : 'text-gray-300'}`}>
			<div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-300'}`}>{icon}</div>
			<span className={active ? 'font-bold' : ''}>{label}</span>
		</div>
	);
}

export default DriverDriveDetailPage;

// % End

