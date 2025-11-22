# MilkyTea API 完整测试脚本
# 测试所有接口功能

$baseUrl = "http://localhost:8080"
$token = ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MilkyTea API 完整测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 测试用户注册
Write-Host "1. 测试用户注册 (POST /api/auth/register)" -ForegroundColor Yellow
$registerBody = @{
    username = "testuser$(Get-Random -Minimum 1000 -Maximum 9999)"
    phone = "138$(Get-Random -Minimum 10000000 -Maximum 99999999)"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✓ 注册成功" -ForegroundColor Green
    Write-Host "  用户ID: $($response.userId)" -ForegroundColor Gray
    Write-Host "  用户名: $($response.username)" -ForegroundColor Gray
    Write-Host "  手机号: $($response.phone)" -ForegroundColor Gray
    $token = $response.token
    $username = $response.username
    $phone = $response.phone
    Write-Host ""
} catch {
    Write-Host "✗ 注册失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 2. 测试用户登录
Write-Host "2. 测试用户登录 (POST /api/auth/login)" -ForegroundColor Yellow
$loginBody = @{
    phone = $phone
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✓ 登录成功" -ForegroundColor Green
    Write-Host "  Token: $($response.token.Substring(0,20))..." -ForegroundColor Gray
    $token = $response.token
    Write-Host ""
} catch {
    Write-Host "✗ 登录失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. 测试获取用户信息
Write-Host "3. 测试获取用户信息 (GET /api/user/profile)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user/profile" -Method Get -Headers $headers
    Write-Host "✓ 获取用户信息成功" -ForegroundColor Green
    Write-Host "  用户名: $($response.username)" -ForegroundColor Gray
    Write-Host "  手机号: $($response.phone)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取用户信息失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 4. 测试更新用户信息
Write-Host "4. 测试更新用户信息 (PUT /api/user/profile)" -ForegroundColor Yellow
$updateProfileBody = @{
    avatar = "https://example.com/avatar-updated.jpg"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user/profile" -Method Put -Body $updateProfileBody -Headers $headers
    Write-Host "✓ 更新用户信息成功" -ForegroundColor Green
    Write-Host "  头像: $($response.avatar)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 更新用户信息失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 5. 测试修改用户名
Write-Host "5. 测试修改用户名 (PATCH /api/user/username)" -ForegroundColor Yellow
$updateUsernameBody = @{
    newUsername = "newuser$(Get-Random -Minimum 1000 -Maximum 9999)"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user/username" -Method Patch -Body $updateUsernameBody -Headers $headers
    Write-Host "✓ 修改用户名成功" -ForegroundColor Green
    Write-Host "  新用户名: $($response.username)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 修改用户名失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 6. 测试修改密码
Write-Host "6. 测试修改密码 (POST /api/user/change-password)" -ForegroundColor Yellow
$changePasswordBody = @{
    oldPassword = "Test123456"
    newPassword = "NewPass123"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/user/change-password" -Method Post -Body $changePasswordBody -Headers $headers
    Write-Host "✓ 修改密码成功" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ 修改密码失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 7. 测试创建品牌
Write-Host "7. 测试创建品牌 (POST /api/brands)" -ForegroundColor Yellow
$brandBody = @{
    name = "测试品牌$(Get-Random -Minimum 100 -Maximum 999)"
    description = "这是一个测试品牌"
    logoUrl = "https://example.com/logo.png"
} | ConvertTo-Json

try {
    $brand = Invoke-RestMethod -Uri "$baseUrl/api/brands" -Method Post -Body $brandBody -Headers $headers
    Write-Host "✓ 创建品牌成功" -ForegroundColor Green
    Write-Host "  品牌ID: $($brand.id)" -ForegroundColor Gray
    Write-Host "  品牌名称: $($brand.name)" -ForegroundColor Gray
    $brandId = $brand.id
    Write-Host ""
} catch {
    Write-Host "✗ 创建品牌失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 8. 测试获取所有品牌
Write-Host "8. 测试获取所有品牌 (GET /api/brands)" -ForegroundColor Yellow
try {
    $brands = Invoke-RestMethod -Uri "$baseUrl/api/brands" -Method Get
    Write-Host "✓ 获取品牌列表成功" -ForegroundColor Green
    Write-Host "  品牌总数: $($brands.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取品牌列表失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 9. 测试获取品牌详情
Write-Host "9. 测试获取品牌详情 (GET /api/brands/{id})" -ForegroundColor Yellow
try {
    $brand = Invoke-RestMethod -Uri "$baseUrl/api/brands/$brandId" -Method Get
    Write-Host "✓ 获取品牌详情成功" -ForegroundColor Green
    Write-Host "  品牌名称: $($brand.name)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取品牌详情失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 10. 测试创建记录
Write-Host "10. 测试创建记录 (POST /api/records)" -ForegroundColor Yellow
$recordBody = @{
    brandId = $brandId
    category = "波霸奶茶"
    sweetness = "半糖"
    iceLevel = "少冰"
    price = 18.50
    rating = 8
    comment = "很好喝"
    consumeDate = (Get-Date -Format "yyyy-MM-dd")
} | ConvertTo-Json

try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Post -Body $recordBody -Headers $headers
    Write-Host "✓ 创建记录成功" -ForegroundColor Green
    Write-Host "  记录ID: $($record.id)" -ForegroundColor Gray
    Write-Host "  品牌: $($record.brandName)" -ForegroundColor Gray
    Write-Host "  价格: $($record.price)" -ForegroundColor Gray
    $recordId = $record.id
    Write-Host ""
} catch {
    Write-Host "✗ 创建记录失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 11. 测试获取记录列表
Write-Host "11. 测试获取记录列表 (GET /api/records)" -ForegroundColor Yellow
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Get -Headers $headers
    Write-Host "✓ 获取记录列表成功" -ForegroundColor Green
    Write-Host "  记录总数: $($records.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取记录列表失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 12. 测试记录筛选 - 按日期
Write-Host "12. 测试记录筛选 - 按日期 (GET /api/records?date=)" -ForegroundColor Yellow
$today = (Get-Date -Format "yyyy-MM-dd")
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records?date=$today" -Method Get -Headers $headers
    Write-Host "✓ 按日期筛选成功" -ForegroundColor Green
    Write-Host "  今日记录数: $($records.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 按日期筛选失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 13. 测试记录筛选 - 按品牌
Write-Host "13. 测试记录筛选 - 按品牌 (GET /api/records?brandId=)" -ForegroundColor Yellow
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records?brandId=$brandId" -Method Get -Headers $headers
    Write-Host "✓ 按品牌筛选成功" -ForegroundColor Green
    Write-Host "  该品牌记录数: $($records.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 按品牌筛选失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 14. 测试获取记录详情
Write-Host "14. 测试获取记录详情 (GET /api/records/{id})" -ForegroundColor Yellow
try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records/$recordId" -Method Get -Headers $headers
    Write-Host "✓ 获取记录详情成功" -ForegroundColor Green
    Write-Host "  品类: $($record.category)" -ForegroundColor Gray
    Write-Host "  评分: $($record.rating)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取记录详情失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 15. 测试更新记录
Write-Host "15. 测试更新记录 (PUT /api/records/{id})" -ForegroundColor Yellow
$updateRecordBody = @{
    rating = 9
    comment = "更新后的评价 - 非常好喝"
} | ConvertTo-Json

try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records/$recordId" -Method Put -Body $updateRecordBody -Headers $headers
    Write-Host "✓ 更新记录成功" -ForegroundColor Green
    Write-Host "  新评分: $($record.rating)" -ForegroundColor Gray
    Write-Host "  新评论: $($record.comment)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 更新记录失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 16. 创建更多记录用于批量删除测试
Write-Host "16. 创建更多记录用于测试" -ForegroundColor Yellow
$recordIds = @($recordId)
for ($i = 0; $i -lt 2; $i++) {
    $testRecordBody = @{
        brandId = $brandId
        category = "测试记录$i"
        sweetness = "半糖"
        iceLevel = "少冰"
        price = 15.00
        rating = 7
    } | ConvertTo-Json
    
    try {
        $testRecord = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Post -Body $testRecordBody -Headers $headers
        $recordIds += $testRecord.id
        Write-Host "  ✓ 创建测试记录 $($i+1): ID=$($testRecord.id)" -ForegroundColor Gray
    } catch {
        Write-Host "  ✗ 创建测试记录失败" -ForegroundColor Red
    }
}
Write-Host ""

# 17. 测试批量删除记录
Write-Host "17. 测试批量删除记录 (POST /api/records/batch-delete)" -ForegroundColor Yellow
$batchDeleteBody = @{
    ids = @($recordIds[1], $recordIds[2])
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/records/batch-delete" -Method Post -Body $batchDeleteBody -Headers $headers
    Write-Host "✓ 批量删除成功" -ForegroundColor Green
    Write-Host "  删除了 2 条记录" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 批量删除失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 18. 测试获取基础统计
Write-Host "18. 测试获取基础统计 (GET /api/statistics/summary)" -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/api/statistics/summary" -Method Get -Headers $headers
    Write-Host "✓ 获取基础统计成功" -ForegroundColor Green
    Write-Host "  总杯数: $($stats.totalCups)" -ForegroundColor Gray
    Write-Host "  总金额: $($stats.totalAmount)" -ForegroundColor Gray
    Write-Host "  平均价格: $($stats.averagePrice)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取基础统计失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 19. 测试获取品牌统计
Write-Host "19. 测试获取品牌统计 (GET /api/statistics/brands)" -ForegroundColor Yellow
try {
    $brandStats = Invoke-RestMethod -Uri "$baseUrl/api/statistics/brands" -Method Get -Headers $headers
    Write-Host "✓ 获取品牌统计成功" -ForegroundColor Green
    Write-Host "  统计品牌数: $($brandStats.statistics.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取品牌统计失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 20. 测试获取趋势分析
Write-Host "20. 测试获取趋势分析 (GET /api/statistics/trends)" -ForegroundColor Yellow
try {
    $trends = Invoke-RestMethod -Uri "$baseUrl/api/statistics/trends?groupBy=day" -Method Get -Headers $headers
    Write-Host "✓ 获取趋势分析成功" -ForegroundColor Green
    Write-Host "  分组方式: $($trends.groupBy)" -ForegroundColor Gray
    Write-Host "  杯数数据点: $($trends.series.cups.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取趋势分析失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 21. 测试获取日历月度数据
Write-Host "21. 测试获取日历月度数据 (GET /api/statistics/calendar/{year}/{month})" -ForegroundColor Yellow
$year = (Get-Date).Year
$month = (Get-Date).Month
try {
    $calendar = Invoke-RestMethod -Uri "$baseUrl/api/statistics/calendar/$year/$month" -Method Get -Headers $headers
    Write-Host "✓ 获取日历数据成功" -ForegroundColor Green
    Write-Host "  年月: $($calendar.year)-$($calendar.month)" -ForegroundColor Gray
    Write-Host "  总杯数: $($calendar.totalCups)" -ForegroundColor Gray
    Write-Host "  消费天数: $($calendar.consumeDays)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ 获取日历数据失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 22. 测试删除单条记录
Write-Host "22. 测试删除单条记录 (DELETE /api/records/{id})" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/records/$recordId" -Method Delete -Headers $headers
    Write-Host "✓ 删除记录成功" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ 删除记录失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 23. 测试删除品牌
Write-Host "23. 测试删除品牌 (DELETE /api/brands/{id})" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/brands/$brandId" -Method Delete -Headers $headers
    Write-Host "✓ 删除品牌成功" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ 删除品牌失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
