# モックAPI使用ガイド

## ✅ 完了した修正内容

### 1. モックAPIの再実装
Next.js API Routes を使ってモックAPIを実装しました。

### 2. lib/api.ts を使用しない構成に変更
各ページコンポーネントから直接 `fetch` でAPIを呼び出すように変更しました。

```typescript
// ❌ 旧: lib/api.ts を使用
import { authApi } from '@/lib/api';
const response = await authApi.login(email, password, isUser);

// ✅ 新: 直接 fetch を呼び出し
const response = await fetch('/api/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ mail: email, password, isuser: isUser }),
});
const data = await response.json();
```

## 📁 実装済みモックAPI

### 認証系
- `POST /api/user/login` - ログイン
- `POST /api/user/regist` - 新規登録
- `GET /api/user/logout` - ログアウト
- `GET /api/user/IsLogin` - ログイン状態確認

### データ取得系
- `GET /api/hitchhiker/boshukensaku` - 募集検索
- `GET /api/driver/drives` - マイドライブ一覧
- `POST /api/point/remain` - ポイント残高
- `GET /api/users/me` - ユーザー情報

## 🔑 テストアカウント

### 一般ユーザー
```
メールアドレス: user@test.com
パスワード: password123
種別: 一般ユーザー
```

### 管理者
```
メールアドレス: admin@test.com
パスワード: admin123
種別: 管理者
```

## 🎯 動作確認できる機能

1. **ログイン** ✅
   - テストアカウントでログイン成功
   - セッションCookieが設定される

2. **ホーム画面** ✅
   - ログイン状態チェック
   - 未ログインの場合はログイン画面へリダイレクト

3. **募集検索** ✅
   - 3件のモックドライブデータが表示される

4. **マイドライブ** ✅
   - 2件のモックドライブが表示される

5. **ポイント画面** ✅
   - 15,000ptが表示される

6. **マイページ/設定** ✅
   - ユーザー情報が表示される

## 💻 使い方

### 1. 開発サーバー起動

```powershell
cd Hitchhiking-frontend
npm run dev
```

### 2. ブラウザでアクセス

```
http://localhost:3000
```

### 3. ログイン

```
メールアドレス: user@test.com
パスワード: password123
```

### 4. 各機能を試す

- ホーム画面から各機能へアクセス
- 募集検索画面でモックデータを確認
- マイドライブでモックデータを確認
- ポイント画面で残高を確認

## 🔧 モックデータのカスタマイズ

モックAPIファイルを編集してデータを変更できます：

```typescript
// src/pages/api/hitchhiker/boshukensaku.ts
const mockDrives = [
  {
    id: '1',
    driverName: '山田太郎',  // ← ここを変更
    departure: '東京駅',     // ← ここを変更
    // ...
  },
];
```

## 📝 修正されたファイル一覧

### モックAPI（新規作成）
- `src/pages/api/user/login.ts`
- `src/pages/api/user/regist.ts`
- `src/pages/api/user/logout.ts`
- `src/pages/api/user/IsLogin.ts`
- `src/pages/api/hitchhiker/boshukensaku.ts`
- `src/pages/api/driver/drives.ts`
- `src/pages/api/point/remain.ts`
- `src/pages/api/users/me.ts`

### ページコンポーネント（lib/api.ts を削除）
- `src/pages/login/index.tsx`
- `src/pages/login/Regist.tsx`
- `src/pages/index.tsx`
- `src/pages/hitch_hiker/Search.tsx`
- `src/pages/driver/drives/index.tsx`
- `src/pages/points/index.tsx`
- `src/pages/settings/index.tsx`
- `src/pages/hitch_hiker/MyPage.tsx`
- `src/pages/inquiry/index.tsx`
- `src/pages/admin/dashboard.tsx`

## ⚠️ 注意事項

### lib/api.ts について
- `lib/api.ts` ファイルは残っていますが、**使用していません**
- 各ページで直接 `fetch` を呼び出しています
- 必要に応じて `lib/api.ts` を削除できます

### 未実装のAPI
以下のAPIはまだモック実装されていません：
- ドライブ作成/編集
- 申請承認/拒否
- 問い合わせ送信
- ポイント履歴
- 管理者機能の各種API

必要に応じて追加してください。

## 🚀 本番環境への切り替え

本番環境では実際のAPIサーバーを使用します：

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://your-fastapi-server.com/api
```

そして、コード内で環境変数を使用：

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const response = await fetch(`${API_BASE}/user/login`, { ... });
```

ただし、現在の実装では `/api` を直接指定しているため、
本番環境に切り替える際は各ページのfetchを修正する必要があります。

