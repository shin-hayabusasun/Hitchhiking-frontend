// % Start(AI Assistant)
// 使わない

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface FetchOptions extends RequestInit {
	params?: Record<string, string | number | boolean>;
}

/**
 * API通信の基底関数
 * @param endpoint APIエンドポイント
 * @param options フェッチオプション
 * @returns レスポンスデータ
 */
async function apiFetch<T>(
	endpoint: string,
	options: FetchOptions = {}
): Promise<T> {
	const { params, ...fetchOptions } = options;

	let url = `${API_BASE_URL}${endpoint}`;

	// クエリパラメータの追加
	if (params) {
		const queryString = new URLSearchParams(
			Object.entries(params).reduce((acc, [key, value]) => {
				acc[key] = String(value);
				return acc;
			}, {} as Record<string, string>)
		).toString();
		if (queryString) {
			url += `?${queryString}`;
		}
	}

	// デフォルトヘッダーの設定
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...fetchOptions.headers,
	};

	// クレデンシャルを含める（セッション管理用）
	const response = await fetch(url, {
		...fetchOptions,
		headers,
		credentials: 'include',
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: 'リクエストに失敗しました',
		}));
		throw new Error(error.message || `HTTP Error: ${response.status}`);
	}

	return response.json();
}

// % ログイン系API
export const authApi = {
	/**
	 * ログイン
	 */
	login: function(email: string, password: string, isUser: number) {
		return apiFetch<{ ok: boolean; isuser: number }>('/user/login', {
			method: 'POST',
			body: JSON.stringify({ mail: email, password, isuser: isUser }),
		});
	},

	/**
	 * 新規登録
	 */
	register: function(data: {
		mail: string;
		password: string;
		name: string[];
		sex: number;
		barthday: number[];
		adress: string[];
		identification: string;
		isdriver: number;
	}) {
		return apiFetch<{ ok: boolean }>('/user/regist', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * ログアウト
	 */
	logout: function() {
		return apiFetch<{ ok: boolean }>('/user/logout', {
			method: 'GET',
		});
	},

	/**
	 * ログイン状態確認
	 */
	checkLogin: function() {
		return apiFetch<{ ok: boolean }>('/user/IsLogin', {
			method: 'GET',
		});
	},
};

// % ドライブ管理API
export const driveApi = {
	/**
	 * マイドライブ一覧取得
	 */
	getMyDrives: function(status?: string) {
		return apiFetch<{ drives: any[] }>('/driver/drives', {
			method: 'GET',
			params: status ? { status } : undefined,
		});
	},

	/**
	 * ドライブ詳細取得
	 */
	getDriveDetail: function(id: string) {
		return apiFetch<{ drive: any }>(`/drives/${id}`, {
			method: 'GET',
		});
	},

	/**
	 * ドライブ新規作成
	 */
	createDrive: function(data: {
		departure: string;
		destination: string;
		departuretime: string;
		capacity: number;
		fee: number;
		message?: string;
		vehiclerules?: any;
	}) {
		return apiFetch<{ id: number; message: string }>('/drives', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * ドライブ更新
	 */
	updateDrive: function(id: string, data: any) {
		return apiFetch<{ message: string }>(`/drives/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * ドライブ削除
	 */
	deleteDrive: function(id: string) {
		return apiFetch<{ message: string }>(`/drives/${id}`, {
			method: 'DELETE',
		});
	},
};

// % 同乗者用API
export const hitchhikerApi = {
	/**
	 * 募集検索
	 */
	searchRecruitments: function(filter?: any) {
		return apiFetch<{ card: any[] }>('/hitchhiker/boshukensaku', {
			method: 'GET',
			body: filter ? JSON.stringify({ filter }) : undefined,
		});
	},
};

// % 申請管理API
export const applicationApi = {
	/**
	 * 申請一覧取得
	 */
	getRequests: function(status?: string) {
		return apiFetch<{ requests: any[] }>('/driver/requests', {
			method: 'GET',
			params: status ? { status } : undefined,
		});
	},

	/**
	 * 申請承認
	 */
	approveApplication: function(id: string) {
		return apiFetch<{ message: string }>(`/applications/${id}/approve`, {
			method: 'POST',
		});
	},

	/**
	 * 申請拒否
	 */
	rejectApplication: function(id: string) {
		return apiFetch<{ message: string }>(`/applications/${id}/reject`, {
			method: 'POST',
		});
	},

	/**
	 * リクエストへの応答
	 */
	respondToRequest: function(targetid: number) {
		return apiFetch<{ message: string }>('/applications', {
			method: 'POST',
			body: JSON.stringify({ targetid, type: 'requests' }),
		});
	},
};

// % 募集検索API
export const searchApi = {
	/**
	 * 近くの募集検索
	 */
	searchNearby: function(lat: number, lng: number, radius: number) {
		return apiFetch<{ requests: any[] }>('/passenger-requests/nearby', {
			method: 'GET',
			params: { lat, lng, radius },
		});
	},

	/**
	 * 条件検索
	 */
	searchByConditions: function(params: {
		from?: string;
		to?: string;
		data?: string;
		minbudget?: number;
		maxbudget?: number;
	}) {
		return apiFetch<{ requests: any[] }>('/passenger-requests', {
			method: 'GET',
			params,
		});
	},

	/**
	 * リクエスト詳細取得
	 */
	getRequestDetail: function(id: string) {
		return apiFetch<{ requests: any; passenger: any }>(
			`/passenger-requests/${id}`,
			{
				method: 'GET',
			}
		);
	},
};

// % ポイント管理API
export const pointApi = {
	/**
	 * ポイント残高取得
	 */
	getBalance: function() {
		return apiFetch<{ totalBalance: number; breakdown?: any }>(
			'/point/remain',
			{
				method: 'POST',
			}
		);
	},

	/**
	 * ポイント履歴取得
	 */
	getHistory: function(params?: {
		type?: string;
		limit?: number;
		offset?: number;
	}) {
		return apiFetch<{ transactions: any[] }>('/point/history', {
			method: 'GET',
			params,
		});
	},

	/**
	 * 注文履歴取得
	 */
	getOrders: function(status?: string) {
		return apiFetch<{ orders: any[] }>('/points/orders', {
			method: 'GET',
			params: status ? { status } : undefined,
		});
	},
};

// % 問い合わせAPI
export const inquiryApi = {
	/**
	 * 問い合わせ送信
	 */
	submit: function(data: {
		category: string;
		email: string;
		subject: string;
		body: string;
	}) {
		return apiFetch<{ message: string }>('/inquiry', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},
};

// % 設定API
export const settingsApi = {
	/**
	 * ユーザー情報取得
	 */
	getUser: function() {
		return apiFetch<{ name: string; email: string; isVerified: boolean }>(
			'/users/me',
			{
				method: 'GET',
			}
		);
	},

	/**
	 * プロフィール更新
	 */
	updateProfile: function(data: {
		lastName?: string;
		firstName?: string;
		birthDate?: string;
		email?: string;
		phone?: string;
		address?: string;
		password?: string;
	}) {
		return apiFetch<{ success: boolean }>('/users/me/profile', {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * 本人確認書類アップロード
	 */
	uploadIdentity: function(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		return fetch(`${API_BASE_URL}/users/me/identity-document`, {
			method: 'POST',
			body: formData,
			credentials: 'include',
		}).then((res) => res.json());
	},

	/**
	 * 通知設定更新
	 */
	updateNotifications: function(data: {
		rideRequest: boolean;
		message: boolean;
		reminder: boolean;
		promotion: boolean;
	}) {
		return apiFetch<{ message: string }>('/settings/notifications', {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},
};

// % 決済API
export const paymentApi = {
	/**
	 * クレジットカード追加
	 */
	addCard: function(data: {
		payment_token: string;
		cardnumber: string;
		name: string;
		date: string;
		code: number;
	}) {
		return apiFetch<{ cardId: string }>('/payment/cards', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * クレジットカード編集
	 */
	updateCard: function(
		id: string,
		data: {
			cardnumber: string;
			name: string;
			date: string;
			code: number;
		}
	) {
		return apiFetch<{ message: string }>(`/payment/cards/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * 決済実行
	 */
	createTransaction: function(driveId: string, amount: number) {
		return apiFetch<{
			transactionId: string;
			status: string;
			paidAt: string;
		}>('/payment/transactions', {
			method: 'POST',
			body: JSON.stringify({ drive_id: driveId, amount }),
		});
	},
};

// % 管理者API
export const adminApi = {
	/**
	 * 管理者統計情報取得
	 */
	getStats: function() {
		return apiFetch<{
			totalUsers: number;
			totalOrders: number;
			totalProductsnumber: number;
			issuedPoints: number;
		}>('/admin/stats', {
			method: 'GET',
		});
	},

	/**
	 * 顧客一覧取得
	 */
	getCustomers: function(params?: {
		limit?: number;
		offset?: number;
		search?: string;
		sort?: string;
	}) {
		return apiFetch<{ customers: any[] }>('admin/customers', {
			method: 'GET',
			params,
		});
	},

	/**
	 * 顧客統計情報取得
	 */
	getCustomerStats: function() {
		return apiFetch<{
			total_count: number;
			verified_count: number;
			warned_count: number;
		}>('admin/customers/stats', {
			method: 'GET',
		});
	},

	/**
	 * 顧客警告送信
	 */
	warnCustomer: function(id: string) {
		return apiFetch<{ message: string; customer: any }>(
			`admin/customers/${id}/warn`,
			{
				method: 'POST',
			}
		);
	},

	/**
	 * 顧客削除
	 */
	deleteCustomer: function(id: string) {
		return apiFetch<{ message: string }>(`admin/customers/${id}`, {
			method: 'DELETE',
		});
	},

	/**
	 * 商品一覧取得
	 */
	getProducts: function(params?: {
		limit?: number;
		offset?: number;
		keyword?: string;
		sort?: string;
	}) {
		return apiFetch<{ products: any[] }>('admin/products', {
			method: 'GET',
			params,
		});
	},

	/**
	 * 商品統計情報取得
	 */
	getProductStats: function() {
		return apiFetch<{
			product_type_count: number;
			sales_product_count: number;
			total_stock: number;
		}>('admin/products/stats', {
			method: 'GET',
		});
	},

	/**
	 * 商品登録
	 */
	createProduct: function(data: {
		name: string;
		category_id: string;
		points: number;
		stock: number;
		description: string;
		alert_threshold: number;
		image: string;
	}) {
		return apiFetch<{ message: string; product: any }>('admin/products', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * 商品更新
	 */
	updateProduct: function(id: string, data: any) {
		return apiFetch<{ message: string; product: any }>(
			`admin/products/${id}`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
			}
		);
	},

	/**
	 * 商品削除
	 */
	deleteProduct: function(id: string) {
		return apiFetch<{ message: string }>(`admin/products/${id}`, {
			method: 'DELETE',
		});
	},

	/**
	 * 在庫統計情報取得
	 */
	getStockStats: function() {
		return apiFetch<{
			total_stock: number;
			warning_count: number;
			total_sales: number;
		}>('admin/stocks/stats', {
			method: 'GET',
		});
	},

	/**
	 * 在庫補充
	 */
	replenishStock: function(id: string, amount: number) {
		return apiFetch<{ message: string; current_stock: number }>(
			`admin/products/${id}/replenish`,
			{
				method: 'POST',
				body: JSON.stringify({ amount }),
			}
		);
	},

	/**
	 * 注文一覧取得
	 */
	getOrders: function(params?: {
		limit?: number;
		offset?: number;
		status?: string;
		search?: string;
		sort?: string;
	}) {
		return apiFetch<{ orders: any[] }>('admin/orders', {
			method: 'GET',
			params,
		});
	},

	/**
	 * 注文統計情報取得
	 */
	getOrderStats: function() {
		return apiFetch<{
			total_orders: number;
			ready_count: number;
			shipped_count: number;
		}>('admin/orders/stats', {
			method: 'GET',
		});
	},

	/**
	 * 注文ステータス更新
	 */
	updateOrderStatus: function(id: string, status: string) {
		return apiFetch<{ message: string; order: any }>(
			`admin/orders/${id}/status`,
			{
				method: 'PUT',
				body: JSON.stringify({ status }),
			}
		);
	},
};

// % End

