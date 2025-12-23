# ヒッチハイクマッチングシステム フロントエンド実装

## 概要

要件.txtに基づいて実装されたNext.jsフロントエンドアプリケーションです。

## 実装済み機能

### ✅ フェーズ1: 基盤・共通機能
- 型定義（`src/types/index.ts`）
- API通信ユーティリティ（`src/lib/api.ts`）
- 共通コンポーネント
  - TitleHeader
  - HitchhikerHeader
  - DriverHeader
  - SearchCard
  - MyDriveCard

### ✅ フェーズ2: ログイン・認証系
- `/login/index.tsx` - ログイン画面
- `/login/Regist.tsx` - 新規登録画面
- `/login/Complete.tsx` - 登録完了画面
- `/login/logout.tsx` - ログアウト画面
- `/index.tsx` - ホーム画面

### ✅ フェーズ3: 同乗者(Hitchhiker)機能
- `/hitch_hiker/Search.tsx` - 募集検索画面
- `/hitch_hiker/DriveDetail/[id].tsx` - ドライブ詳細画面
- `/hitch_hiker/passenger/CreateDrivePassenger.tsx` - 募集作成画面
- `/hitch_hiker/MyPage.tsx` - マイページ画面

### ✅ フェーズ4: 運転者(Driver)機能
- `/driver/drives/index.tsx` - マイドライブ画面
- `/driver/drives/create.tsx` - ドライブ作成画面
- `/driver/requests/index.tsx` - 申請確認画面

### ✅ フェーズ5: ポイント・設定機能
- `/points/index.tsx` - ポイントホーム画面
- `/settings/index.tsx` - 設定ホーム画面
- `/inquiry/index.tsx` - 問い合わせ画面

### ✅ フェーズ6: 管理者機能
- `/admin/dashboard.tsx` - 管理者ダッシュボード
- `/admin/users/index.tsx` - 顧客管理画面
- `/admin/products/products.tsx` - 商品情報管理画面

## ディレクトリ構造

```
src/
├── components/       # 共通コンポーネント
│   ├── TitleHeader.tsx
│   ├── hitch_hiker/
│   │   ├── Header.tsx
│   │   └── SearchCard.tsx
│   └── driver/
│       ├── DriverHeader.tsx
│       └── MyDriveCard.tsx
├── lib/             # ユーティリティ
│   └── api.ts       # API通信
├── pages/           # ページコンポーネント
│   ├── index.tsx
│   ├── login/
│   ├── hitch_hiker/
│   ├── driver/
│   ├── points/
│   ├── settings/
│   ├── inquiry/
│   └── admin/
├── styles/          # スタイル
│   └── globals.css
└── types/           # 型定義
    └── index.ts
```

## API連携

- **ベースURL**: `/api` (環境変数 `NEXT_PUBLIC_API_BASE_URL` で変更可能)
- **認証**: Cookie ベースのセッション管理
- **エンドポイント**: `src/lib/api.ts` に定義

## コーディング規約

### TypeScript
- ✅ `export default` は使用禁止（名前付きエクスポートのみ）
- ✅ 型安全性を重視
- ✅ 関数宣言を使用

### HTML/JSX
- ✅ UTF-8エンコーディング
- ✅ セマンティックなマークアップ
- ✅ アクセシビリティ考慮

### CSS
- ✅ クラス名はハイフン区切り
- ✅ ショートハンドプロパティを使用
- ✅ レスポンシブデザイン対応

## セットアップ

### 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集してAPIのベースURLを設定してください。

### 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## 注意事項

### APIモック

現在、APIは実装されていません。フロントエンドのみの実装となります。
実際にAPIと接続する際は、FastAPIバックエンドを起動し、環境変数でAPIのURLを設定してください。

### 未実装の機能

以下の機能は基本画面のみ実装されており、詳細機能は今後の実装が必要です：

- ドライブ編集画面
- 募集編集画面
- ポイント履歴画面
- ポイント交換画面
- 注文履歴画面
- 通知設定画面
- 決済情報画面
- 本人確認画面
- 在庫管理画面
- 注文管理画面

### スタイリング

基本的なスタイルは `globals.css` に定義されていますが、
より洗練されたデザインのためには、追加のCSSまたはCSSフレームワークの導入を推奨します。

## 今後の開発

1. 残りのページコンポーネントの実装
2. 詳細なUIデザインの実装
3. バリデーション強化
4. エラーハンドリングの改善
5. ローディング状態の最適化
6. テストコードの追加

## ライセンス

内部プロジェクト用

## 作成者

ジー・フォー・ソリューションズ

