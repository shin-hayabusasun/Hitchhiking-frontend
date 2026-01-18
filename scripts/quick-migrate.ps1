# 簡易版: 環境変数対応への一括移行スクリプト
# 残りのファイルを一括で変換

Write-Host "残りのファイルを環境変数対応に変換します..." -ForegroundColor Green

# 変換対象のファイルリスト
$files = @(
    "src/pages/hitch_hiker/DriveDetail/[id].tsx",
    "src/pages/driver/search/index.tsx",
    "src/pages/driver/nearby/index.tsx",
    "src/pages/hitch_hiker/review.tsx",
    "src/pages/driver/drivekanri/completion.tsx",
    "src/pages/driver/drivekanri/review.tsx",
    "src/pages/driver/drives/edit/[driveId].tsx",
    "src/pages/driver/drivekanri/schedule.tsx",
    "src/pages/settings/identity.tsx",
    "src/pages/driver/mypage/index.tsx",
    "src/pages/driver/mypage/edit.tsx",
    "src/pages/driver/drives/create.tsx",
    "src/pages/admin/users/index.tsx",
    "src/components/driver/MyDriveCard.tsx",
    "src/pages/settings/notifications.tsx",
    "src/pages/settings/index.tsx",
    "src/pages/points/orders/index.tsx",
    "src/pages/driver/drives/detail/[id].tsx",
    "src/pages/admin/dashboard.tsx",
    "src/pages/points/index.tsx",
    "src/pages/points/history.tsx",
    "src/pages/points/exchange/index.tsx",
    "src/pages/hitch_hiker/passenger/EditDrivePassenger.tsx",
    "src/pages/hitch_hiker/passenger/CreateDrivePassenger.tsx",
    "src/pages/hitch_hiker/RecruitmentManagement.tsx",
    "src/pages/hitch_hiker/MyPage.tsx",
    "src/pages/hitch_hiker/EditMyPage.tsx",
    "src/components/hitch_hiker/RecruitmentManagementCard.tsx"
)

$count = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "処理中: $file" -ForegroundColor Yellow
        
        $content = Get-Content -Path $file -Raw
        $modified = $false
        
        # URLを置換
        if ($content -match "http://54\.165\.126\.189:8000") {
            # getApiUrl() に置換
            $content = $content -replace "'http://54\.165\.126\.189:8000(/[^']*)'", "getApiUrl('`$1')"
            $content = $content -replace '"http://54\.165\.126\.189:8000(/[^"]*)"', 'getApiUrl("$1")'
            $content = $content -replace '`http://54\.165\.126\.189:8000(/[^`]*)`', 'getApiUrl(`$1`)'
            
            # テンプレートリテラル内のURL
            $content = $content -replace '\$\{([^}]+)\}', '${$1}'
            
            # import文を追加（存在しない場合）
            if ($content -notmatch "import.*getApiUrl.*from.*@/config/api") {
                # 最初のimport文を探す
                if ($content -match "(import .+? from .+?;\r?\n)") {
                    $firstMatch = $Matches[0]
                    $insertPoint = $content.IndexOf($firstMatch) + $firstMatch.Length
                    $content = $content.Insert($insertPoint, "import { getApiUrl } from '@/config/api';`n")
                }
            }
            
            Set-Content -Path $file -Value $content -NoNewline
            $count++
            Write-Host "✓ 完了: $file" -ForegroundColor Green
        } else {
            Write-Host "- スキップ (変更不要): $file" -ForegroundColor Gray
        }
    } else {
        Write-Host "! ファイルが見つかりません: $file" -ForegroundColor Red
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "変換完了!" -ForegroundColor Green
Write-Host "変換したファイル数: $count" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
