/**
 * API設定
 * 
 * 環境変数からAPIのベースURLを取得します。
 * Vercelにデプロイする際は、環境変数 NEXT_PUBLIC_API_BASE_URL を設定してください。
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://54.165.126.189:8000';

/**
 * APIエンドポイントのフルURLを生成
 * @param path APIパス（例: '/api/user/login'）
 * @returns フルURL
 */
export function getApiUrl(path: string): string {
  // パスが / で始まっていない場合は追加
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
