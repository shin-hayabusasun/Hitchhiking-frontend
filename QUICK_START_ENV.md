# 環境変数対応 クイックスタートガイド

## 🚀 3ステップでセットアップ

### ステップ1: 環境変数ファイルを作成

PowerShellで以下のコマンドを実行：

```powershell
.\scripts\setup-env.ps1
```

または、手動で `.env.local` ファイルを作成し、以下を記述：

```env
NEXT_PUBLIC_API_BASE_URL=http://54.165.126.189:8000
```

### ステップ2: 既存コードを環境変数対応に移行（オプション）

PowerShellで以下のコマンドを実行：

```powershell
.\scripts\migrate-to-env.ps1
```

このスクリプトは自動的に：
- すべての `http://54.165.126.189:8000` を `getApiUrl()` に置換
- 必要なimport文を追加

### ステップ3: 開発サーバーを再起動

```powershell
npm run dev
```

## ✅ 動作確認

ブラウザで `http://localhost:3000` にアクセスし、ログインなどのAPI呼び出しが正常に動作することを確認してください。

## 📝 新しいコードの書き方

### 推奨方法

```typescript
import { getApiUrl } from '@/config/api';

const response = await fetch(getApiUrl('/api/user/login'), {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ mail, password }),
});
```

### 従来の方法（非推奨）

```typescript
// ❌ 直接URLを書かない
const response = await fetch('http://54.165.126.189:8000/api/user/login', {
  // ...
});
```

## 🌐 Vercelへのデプロイ

1. Vercelダッシュボードにログイン
2. プロジェクト → Settings → Environment Variables
3. 以下を追加：
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `http://54.165.126.189:8000`
   - **Environment**: Production, Preview, Development
4. Save して再デプロイ

## 📚 詳細ドキュメント

より詳しい情報は以下を参照：
- 詳細な設定方法: `ENV_SETUP.md`
- 環境変数の例: `ENV_EXAMPLE.txt`

## ❓ トラブルシューティング

### 環境変数が反映されない

```powershell
# 開発サーバーを再起動
# Ctrl+C で停止後、再実行
npm run dev
```

### ビルドエラーが発生する

`.env.local` ファイルが `package.json` と同じディレクトリにあることを確認してください。

## 🎯 現在の状態

### ✅ 完了済み
- 環境変数設定ファイル作成 (`src/config/api.ts`)
- 以下のファイルは環境変数対応済み：
  - `src/pages/login/index.tsx`
  - `src/pages/index.tsx`
  - `src/pages/chat/[chatid].tsx`

### 🔄 要対応
- 残りのファイル（約35ファイル）
  - `migrate-to-env.ps1` スクリプトで一括変換可能

## 💡 ヒント

- 開発環境ではローカルのバックエンド（`http://localhost:8000`）を使用する場合は、`.env.local` の値を変更
- ステージング環境と本番環境でURLを切り替える場合は、Vercelの環境変数設定を使用
