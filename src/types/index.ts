// % Start(AI Assistant)
// 型定義ファイル: システム全体で使用する型を定義

// ユーザー関連の型
export interface User {
	id: string;
	email: string;
	name: string;
	firstName?: string;
	lastName?: string;
	birthDate?: string;
	phone?: string;
	address?: string;
	sex?: number;
	isVerified: boolean;
	isDriver: boolean;
	profileImage?: string;
	createdAt: string;
}

// ドライブ関連の型
export interface Drive {
	id: string;
	driverId: string;
	driverName: string;
	driverProfile?: User;
	departure: string;
	destination: string;
	departureTime: string;
	capacity: number;
	currentPassengers: number;
	fee: number;
	message?: string;
	vehicleRules?: VehicleRules;
	status: DriveStatus;
	matchingScore?: number;
	createdAt: string;
	updatedAt: string;
}

export interface VehicleRules {
	noSmoking?: boolean;
	petAllowed?: boolean;
	musicAllowed?: boolean;
	conversation?: string;
}

export type DriveStatus = 
	| "recruiting" 
	| "matched" 
	| "in_progress" 
	| "completed" 
	| "cancelled";

// 申請関連の型
export interface Application {
	id: string;
	driveId: string;
	passengerId: string;
	passengerName: string;
	passengerProfile?: User;
	status: ApplicationStatus;
	message?: string;
	createdAt: string;
	updatedAt: string;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

// 同乗者リクエスト関連の型
export interface PassengerRequest {
	id: string;
	passengerId: string;
	passengerName: string;
	passengerProfile?: User;
	departure: string;
	destination: string;
	desiredDateTime: string;
	budget: number;
	message?: string;
	status: string;
	matchingScore?: number;
	createdAt: string;
}

// ポイント関連の型
export interface PointBalance {
	totalBalance: number;
	breakdown?: {
		earned: number;
		spent: number;
	};
}

export interface PointTransaction {
	id: string;
	type: "earn" | "spend" | "refund";
	amount: number;
	description: string;
	date: string;
}

// 商品関連の型
export interface Product {
	id: string;
	name: string;
	categoryId: string;
	points: number;
	stock: number;
	description: string;
	alertThreshold: number;
	image?: string;
	createdAt: string;
	updatedAt: string;
}

// 注文関連の型
export interface Order {
	id: string;
	userId: string;
	productId: string;
	productName: string;
	quantity: number;
	totalPoints: number;
	status: OrderStatus;
	createdAt: string;
	updatedAt: string;
}

export type OrderStatus = 
	| "pending" 
	| "preparing" 
	| "shipped" 
	| "delivered" 
	| "cancelled";

// 管理者統計情報の型
export interface AdminStats {
	totalUsers: number;
	totalOrders: number;
	totalProducts: number;
	issuedPoints: number;
}

export interface CustomerStats {
	totalCount: number;
	verifiedCount: number;
	warnedCount: number;
}

export interface ProductStats {
	productTypeCount: number;
	salesProductCount: number;
	totalStock: number;
}

export interface StockStats {
	totalStock: number;
	warningCount: number;
	totalSales: number;
}

export interface OrderStats {
	totalOrders: number;
	readyCount: number;
	shippedCount: number;
}

// API レスポンスの型
export interface ApiResponse<T> {
	ok: boolean;
	data?: T;
	message?: string;
	error?: string;
}

// フィルター関連の型
export interface SearchFilter {
	from?: string;
	to?: string;
	date?: string;
	minBudget?: number;
	maxBudget?: number;
	departureTime?: string;
	capacity?: number;
}

// 設定関連の型
export interface NotificationSettings {
	rideRequest: boolean;
	message: boolean;
	reminder: boolean;
	promotion: boolean;
}

export interface PaymentCard {
	id: string;
	cardNumber: string;
	name: string;
	expiryDate: string;
	isDefault: boolean;
}

// レビュー関連の型
export interface Review {
	id: string;
	driveId: string;
	reviewerId: string;
	revieweeId: string;
	rating: number;
	comment?: string;
	createdAt: string;
}

// 問い合わせ関連の型
export interface Inquiry {
	category: string;
	email: string;
	subject: string;
	body: string;
}

// % End

