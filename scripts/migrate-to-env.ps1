# 環境変数対応への一括移行スクリプト
# Usage: .\scripts\migrate-to-env.ps1

Write-Host "環境変数対応への移行を開始します..." -ForegroundColor Green

# srcディレクトリ内のすべての.tsxと.tsファイルを取得
$files = Get-ChildItem -Path "src" -Include "*.tsx", "*.ts" -Recurse

$totalFiles = 0
$modifiedFiles = 0

foreach ($file in $files) {
    $totalFiles++
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    # http://54.165.126.189:8000 を検索
    if ($content -match "http://54\.165\.126\.189:8000") {
        Write-Host "処理中: $($file.FullName)" -ForegroundColor Yellow
        
        # URLを getApiUrl() に置換
        $newContent = $content -replace "'http://54\.165\.126\.189:8000(/[^']*)'", "getApiUrl('`$1')"
        $newContent = $newContent -replace '"http://54\.165\.126\.189:8000(/[^"]*)"', 'getApiUrl("$1")'
        $newContent = $newContent -replace '`http://54\.165\.126\.189:8000(/[^`]*)`', 'getApiUrl(`$1`)'
        
        # API_BASE = の形式も対応
        $newContent = $newContent -replace "= 'http://54\.165\.126\.189:8000/api", "= getApiUrl('/api"
        $newContent = $newContent -replace '= "http://54\.165\.126\.189:8000/api', '= getApiUrl("/api'
        
        # importが存在しない場合は追加
        if ($newContent -notmatch "import.*getApiUrl.*from.*@/config/api") {
            # 最初のimport文の後に追加
            if ($newContent -match "(import .* from .*;\r?\n)") {
                $firstImport = $Matches[1]
                $newContent = $newContent -replace [regex]::Escape($firstImport), "$firstImport`nimport { getApiUrl } from '@/config/api';`n"
            }
        }
        
        # ファイルを上書き
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        $modifiedFiles++
        Write-Host "✓ 修正完了: $($file.FullName)" -ForegroundColor Green
        $modified = $true
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "移行完了!" -ForegroundColor Green
Write-Host "総ファイル数: $totalFiles" -ForegroundColor White
Write-Host "修正したファイル数: $modifiedFiles" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan

if ($modifiedFiles -gt 0) {
    Write-Host "`n次のステップ:" -ForegroundColor Yellow
    Write-Host "1. .env.local ファイルを作成（ENV_EXAMPLE.txt を参照）" -ForegroundColor White
    Write-Host "2. 開発サーバーを再起動: npm run dev" -ForegroundColor White
    Write-Host "3. 動作確認を行ってください" -ForegroundColor White
}
