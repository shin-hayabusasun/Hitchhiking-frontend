# 環境変数ファイルのセットアップスクリプト
# Usage: .\scripts\setup-env.ps1

Write-Host "環境変数ファイルのセットアップを開始します..." -ForegroundColor Green

# .env.local ファイルのパス
$envFile = ".env.local"

# 既に存在する場合は確認
if (Test-Path $envFile) {
    Write-Host "`n警告: .env.local ファイルは既に存在します。" -ForegroundColor Yellow
    $response = Read-Host "上書きしますか? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "セットアップをキャンセルしました。" -ForegroundColor Red
        exit
    }
}

# .env.local ファイルの内容
$envContent = @"
# バックエンドAPIのベースURL
# Vercelにデプロイする際は、Vercelの環境変数設定から同じ変数を設定してください
NEXT_PUBLIC_API_BASE_URL=http://54.165.126.189:8000
"@

# ファイルを作成
Set-Content -Path $envFile -Value $envContent

Write-Host "`n✓ .env.local ファイルを作成しました！" -ForegroundColor Green
Write-Host "`nファイルの内容:" -ForegroundColor Cyan
Write-Host "================================"
Write-Host $envContent
Write-Host "================================"

Write-Host "`n次のステップ:" -ForegroundColor Yellow
Write-Host "1. 必要に応じて .env.local の値を編集" -ForegroundColor White
Write-Host "2. 開発サーバーを起動: npm run dev" -ForegroundColor White
Write-Host "3. 環境変数が正しく読み込まれているか確認" -ForegroundColor White

Write-Host "`n詳細は ENV_SETUP.md を参照してください。" -ForegroundColor Cyan
