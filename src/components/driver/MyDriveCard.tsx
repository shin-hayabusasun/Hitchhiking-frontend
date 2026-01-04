// % Start(AI Assistant)
// マイドライブカードコンポーネント: 自分が作成したドライブ情報を表示

import { useRouter } from 'next/router';
import { Calendar, Users, MessageCircle, MapPin, ChevronRight } from 'lucide-react';

interface MyDriveCardProps {
	id: string;
	departure: string;
	destination: string;
	departureTime: string;
	fee: number;
	capacity: number;
	currentPassengers: number;
	status: string;
	onEdit?: () => void;
	onDelete?: () => void;
    onDetail?: () => void;
}

export function MyDriveCard({
	id,
	departure,
	destination,
	departureTime,
	fee,
	capacity,
	currentPassengers,
	status,
	onEdit,
	onDelete,
    onDetail,
}: MyDriveCardProps) {
	const router = useRouter();

	function handleDetailClick() {
		router.push(`/driver/drives/${id}`);
	}

	function handleEditClick() {
		if (onEdit) {
			onEdit();
		} else {
			router.push(`/driver/drives/edit/${id}`);
		}
	}

    function handleDetailClick() {
		if (onDetail) {
			onDetail();
		} else {
			router.push(`/driver/drives/detail/${id}`);
		}
	}

	// ステータス表示
	const statusLabels: Record<string, { label: string, badgeClass: string }> = {
		recruiting: { label: '🕒 募集中', badgeClass: 'bg-blue-50 text-blue-700' },
        matched: { label: '✓ 確定済み', badgeClass: 'bg-green-50 text-green-700' },
        in_progress: { label: '🚗 進行中', badgeClass: 'bg-amber-50 text-amber-700' },
        completed: { label: '🏁 完了', badgeClass: 'bg-gray-100 text-gray-700' },
        cancelled: { label: '❌ 中止', badgeClass: 'bg-red-50 text-red-700' },
	};

	// 日時のフォーマット
	const formattedDate = new Date(departureTime).toLocaleString('ja-JP', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});

	const currentStatus = statusLabels[status] || { label: status, badgeClass: 'bg-gray-100 text-gray-600' };

// 	return (
// 		// <div className="my-drive-card">
// 		// 	<div className="my-drive-card-header">
// 		// 		<span className={`status-badge status-${status}`}>
// 		// 			{statusLabel}
// 		// 		</span>
// 		// 	</div>
// 		// 	<div className="my-drive-card-body">
// 		// 		<div className="my-drive-card-route">
// 		// 			<div className="my-drive-card-location">
// 		// 				<span className="location-label">出発</span>
// 		// 				<span className="location-value">{departure}</span>
// 		// 			</div>
// 		// 			<div className="my-drive-card-arrow">→</div>
// 		// 			<div className="my-drive-card-location">
// 		// 				<span className="location-label">目的地</span>
// 		// 				<span className="location-value">{destination}</span>
// 		// 			</div>
// 		// 		</div>
// 		// 		<div className="my-drive-card-info">
// 		// 			<div className="info-item">
// 		// 				<span className="info-label">出発時刻</span>
// 		// 				<span className="info-value">{formattedDate}</span>
// 		// 			</div>
// 		// 			<div className="info-item">
// 		// 				<span className="info-label">料金</span>
// 		// 				<span className="info-value">¥{fee.toLocaleString()}</span>
// 		// 			</div>
// 		// 			<div className="info-item">
// 		// 				<span className="info-label">乗車人数</span>
// 		// 				<span className="info-value">
// 		// 					{currentPassengers}/{capacity}
// 		// 				</span>
// 		// 			</div>
// 		// 		</div>
// 		// 	</div>
// 		// 	<div className="my-drive-card-footer">
// 		// 		<button
// 		// 			type="button"
// 		// 			className="btn btn-secondary"
// 		// 			onClick={handleDetailClick}
// 		// 		>
// 		// 			詳細を見る
// 		// 		</button>
// 		// 		{status === 'recruiting' && (
// 		// 			<>
// 		// 				<button
// 		// 					type="button"
// 		// 					className="btn btn-primary"
// 		// 					onClick={handleEditClick}
// 		// 				>
// 		// 					編集
// 		// 				</button>
// 		// 				{onDelete && (
// 		// 					<button
// 		// 						type="button"
// 		// 						className="btn btn-danger"
// 		// 						onClick={onDelete}
// 		// 					>
// 		// 						削除
// 		// 					</button>
// 		// 				)}
// 		// 			</>
// 		// 		)}
// 		// 	</div>
// 		// </div>
// 		<div style={styles.card}>
// 			{/* ヘッダー部分 */}
// 			<div style={styles.header}>
// 				<div style={styles.badge}>{statusLabel}</div>
// 				<button onClick={() => router.push(`/driver/drives/edit/${id}`)} style={styles.editBtn}>
// 					編集
// 				</button>
// 			</div>

// 			{/* ルート情報 */}
// 			<div style={styles.routeContainer}>
// 				<div style={styles.locationRow}>
// 					<div style={styles.dotGreen} />
// 					<div>
// 						<span style={styles.locLabel}>出発地</span>
// 						<span style={styles.locValue}>{departure}</span>
// 					</div>
// 				</div>
// 				<div style={styles.locationRow}>
// 					<div style={styles.dotRed} />
// 					<div>
// 						<span style={styles.locLabel}>目的地</span>
// 						<span style={styles.locValue}>{destination}</span>
// 					</div>
// 				</div>
// 			</div>

// 			{/* 詳細情報 */}
// 			<div style={styles.infoGrid}>
// 				<span>📅 {new Date(departureTime).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
// 				<span style={styles.price}>$ ¥{fee} /人</span>
// 				<span>👤 {currentPassengers}/{capacity}名</span>
// 			</div>

// 			{/* 同乗者情報（確定時のみ表示） */}
// 			{status === 'matched' && (
// 				<div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
// 					<p style={{ marginBottom: '4px' }}>承認済み同乗者アカウント</p>
// 					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
// 						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// 							<div style={{ width: '32px', height: '32px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>山</div>
// 							<div>
// 								<div style={{ color: '#374151', fontWeight: 'bold' }}>山田 太郎</div>
// 								<div style={{ fontSize: '10px' }}>2名で同乗</div>
// 							</div>
// 						</div>
// 						<span>💬</span>
// 					</div>
// 				</div>
// 			)}

// 			{/* 詳細を見るボタン */}
// 			<button
// 				style={styles.footerBtn}
// 				onClick={() => router.push(`/driver/drives/${id}`)}
// 			>
// 				詳細を見る
// 			</button>
// 		</div>
// 	);
// }
return (
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-center mb-4">
                {/* ★ statusConfig からラベルと色を取得 */}
                <div className={`px-3 py-1 rounded-full text-[11px] font-bold ${currentStatus.badgeClass}`}>
                    {currentStatus.label}
                </div>
                <button onClick={handleEditClick} className="text-sm font-bold text-gray-400 hover:text-gray-600">
                    編集
                </button>
            </div>

            {/* ルート情報 */}
            <div className="flex flex-col gap-3 mb-4 relative ml-1">
                <div className="absolute left-[5px] top-[14px] bottom-[14px] w-[1px] bg-gray-200" />
                <div className="flex items-start gap-3 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 border-2 border-white shadow-sm" />
                    <div>
                        <span className="text-[10px] text-gray-400 block leading-none mb-1 text-left">出発地</span>
                        <span className="text-sm font-bold text-gray-800">{departure}</span>
                    </div>
                </div>
                <div className="flex items-start gap-3 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 border-2 border-white shadow-sm" />
                    <div>
                        <span className="text-[10px] text-gray-400 block leading-none mb-1 text-left">目的地</span>
                        <span className="text-sm font-bold text-gray-800">{destination}</span>
                    </div>
                </div>
            </div>

            {/* 詳細情報 */}
            <div className="flex items-center justify-between text-[12px] text-gray-500 mb-4 pb-4 border-b border-gray-50 px-1">
                <div className="flex items-center gap-1"><Calendar size={14} className="text-gray-300" /><span>{formattedDate}</span></div>
                <div className="flex items-center gap-1 font-bold text-green-600 text-sm"><span>¥{fee.toLocaleString()}</span><span className="text-[10px] font-normal text-gray-400"></span></div>
                <div className="flex items-center gap-1"><Users size={14} className="text-gray-300" /><span>{currentPassengers}/{capacity}名</span></div>
            </div>

            {/* 同乗者情報（確定時のみ表示） */}
            {status === 'matched' && (
                <div className="mb-4">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase">承認済み同乗者</p>
                    <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">山</div>
                            <div>
                                <div className="text-xs font-bold text-gray-700">山田 太郎</div>
                                <div className="text-[10px] text-gray-400 font-medium">2名で同乗</div>
                            </div>
                        </div>
                        <button className="p-2 text-blue-500"><MessageCircle size={18} /></button>
                    </div>
                </div>
            )}

            <button onClick={handleDetailClick} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-1">
                詳細を見る <ChevronRight size={16} />
            </button>
        </div>
    );
}

// % End

