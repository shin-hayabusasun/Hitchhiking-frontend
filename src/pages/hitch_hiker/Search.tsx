// % Start(稗田隼也)
// 募集検索画面: 同乗者向けの募集検索画面を表示するUI

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { HitchhikerHeader } from '@/components/hitch_hiker/Header';
import { SearchCard } from '@/components/hitch_hiker/SearchCard';

interface Drive {
	id: string;
	driverName: string;
	departure: string;
	destination: string;
	departureTime: string;
	fee: number;
	capacity: number;
	currentPassengers: number;
	matchingScore?: number;
}

export function SearchPage() {
	const router = useRouter();
	const [drives, setDrives] = useState<Drive[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// 募集情報取得
	useEffect(() => {
		async function fetchRecruitments() {
			try {
				const response = await fetch('/api/hitchhiker/boshukensaku', {
					method: 'GET',
					credentials: 'include',
				});
				const data = await response.json();
				setDrives(data.card || []);
			} catch (err) {
				setError('募集情報の取得に失敗しました');
			} finally {
				setLoading(false);
			}
		}

		fetchRecruitments();
	}, []);

	function handleManagementClick() {
		router.push('/hitch_hiker/RecruitmentManagement');
	}

	function handleCreateClick() {
		router.push('/hitch_hiker/passenger/CreateDrivePassenger');
	}

	return (
		<div className="search-page">
			<HitchhikerHeader title="募集検索" />

			<div className="search-container">
				<div className="search-actions">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleManagementClick}
					>
						募集管理へ
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleCreateClick}
					>
						新規募集作成
					</button>
				</div>

				{loading && (
					<div className="loading-container">
						<div className="loading-spinner"></div>
					</div>
				)}

				{error && <div className="error-message">{error}</div>}

				{!loading && !error && drives.length === 0 && (
					<div className="empty-state">
						<p>現在、募集がありません</p>
					</div>
				)}

				{!loading && !error && drives.length > 0 && (
					<div className="search-results">
						{drives.map((drive) => {
							return (
								<SearchCard
									key={drive.id}
									id={drive.id}
									driverName={drive.driverName}
									departure={drive.departure}
									destination={drive.destination}
									departureTime={drive.departureTime}
									fee={drive.fee}
									capacity={drive.capacity}
									currentPassengers={drive.currentPassengers}
									matchingScore={drive.matchingScore}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default SearchPage;

// % End

