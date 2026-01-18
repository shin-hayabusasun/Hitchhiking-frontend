# 環境変数の設定ガイド

## 概要

このプロジェクトでは、バックエンドAPIのURLを環境変数で管理しています。これにより、開発環境・ステージング環境・本番環境で異なるURLを簡単に切り替えることができます。

## 環境変数の設定

### 1. ローカル開発環境

プロジェクトのルートディレクトリに `.env.local` ファイルを作成してください。

```bash
# プロジェクトルートで実行
touch .env.local
```

`.env.local` ファイルに以下の内容を追加：

```env
# バックエンドAPIのベースURL
NEXT_PUBLIC_API_BASE_URL=http://54.165.126.189:8000
```

**注意**: `.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

### 2. Vercelへのデプロイ

Vercelにデプロイする際は、以下の手順で環境変数を設定します：

1. Vercelのダッシュボードにアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables** に移動
4. 以下の環境変数を追加：
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `http://54.165.126.189:8000`（または本番環境のURL）
   - **Environment**: Production / Preview / Development（必要に応じて選択）

5. **Save** をクリック
6. プロジェクトを再デプロイ

## コードでの使用方法

### パターン1: `getApiUrl` 関数を使用（推奨）

```typescript
import { getApiUrl } from '@/config/api';

// 使用例
const response = await fetch(getApiUrl('/api/user/login'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ mail, password }),
});
```

### パターン2: 直接環境変数を使用

```typescript
import { API_BASE_URL } from '@/config/api';

// 使用例
const response = await fetch(`${API_BASE_URL}/api/user/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ mail, password }),
});
```

## 既存コードの移行

### 移行前

```typescript
const response = await fetch('http://54.165.126.189:8000/api/user/login', {
  method: 'POST',
  // ...
});
```

### 移行後

```typescript
import { getApiUrl } from '@/config/api';

const response = await fetch(getApiUrl('/api/user/login'), {
  method: 'POST',
  // ...
});
```

## 一括置換の手順（VS Code使用時）

1. **検索と置換を開く**: `Ctrl+Shift+H` (Windows/Linux) または `Cmd+Shift+H` (Mac)

2. **検索**: 
   ```
   'http://54.165.126.189:8000
   ```

3. **置換**: 
   ```
   getApiUrl('
   ```

4. **ファイル指定**: `src/**/*.{ts,tsx}`

5. **すべて置換** をクリック

6. **各ファイルにimport文を追加**:
   ```typescript
   import { getApiUrl } from '@/config/api';
   ```

## トラブルシューティング

### 環境変数が反映されない場合

1. **開発サーバーを再起動**
   ```bash
   # サーバーを停止（Ctrl+C）してから再起動
   npm run dev
   ```

2. **.env.local ファイルの場所を確認**
   - ファイルは `package.json` と同じディレクトリに配置する必要があります

3. **環境変数名を確認**
   - クライアントサイドで使用する環境変数は `NEXT_PUBLIC_` プレフィックスが必須です

4. **Vercelでの確認**
   - Vercelのダッシュボードで環境変数が正しく設定されているか確認
   - 設定後、必ずプロジェクトを再デプロイ

### ビルドエラーが発生する場合

環境変数が設定されていない場合のデフォルト値を確保するため、`src/config/api.ts` では以下のようにフォールバックを設定しています：

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://54.165.126.189:8000';
```

## 環境別の設定例

### 開発環境 (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### ステージング環境 (Vercel)
```env
NEXT_PUBLIC_API_BASE_URL=http://staging.example.com:8000
```

### 本番環境 (Vercel)
```env
NEXT_PUBLIC_API_BASE_URL=http://54.165.126.189:8000
```

## 修正済みファイル

以下のファイルは既に環境変数を使用するように修正されています：

- ✅ `src/pages/login/index.tsx`
- ✅ `src/pages/index.tsx`
- ✅ `src/pages/chat/[chatid].tsx`

## 修正が必要なファイル一覧

以下のファイルはまだ修正が必要です。上記の「一括置換の手順」を参考に修正してください：

- `src/pages/driver/requests/index.tsx`
- `src/pages/driver/drivekanri/progress.tsx`
- `src/pages/hitch_hiker/MyRequest.tsx`
- その他、`http://54.165.126.189:8000` を含むすべてのファイル

## 参考リンク

- [Next.js 環境変数ドキュメント](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel 環境変数設定](https://vercel.com/docs/concepts/projects/environment-variables)
