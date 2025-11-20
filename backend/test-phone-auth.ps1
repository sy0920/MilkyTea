# 测试新的手机号注册和登录 API

Write-Host "测试 1: 使用手机号注册新用户" -ForegroundColor Green
$registerBody = @{
    username = 'testuser001'
    phone = '13912345678'
    password = 'password123'
    nickname = '测试用户'
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/register' `
        -Method POST `
        -Body $registerBody `
        -ContentType 'application/json' `
        -UseBasicParsing
    
    Write-Host "注册成功!" -ForegroundColor Green
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "Token: $($registerData.token)" -ForegroundColor Cyan
    Write-Host "用户名: $($registerData.username)" -ForegroundColor Cyan
    Write-Host "手机号: $($registerData.phone)" -ForegroundColor Cyan
    
    $token = $registerData.token
} catch {
    Write-Host "注册失败: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n测试 2: 使用手机号登录" -ForegroundColor Green
$loginBody = @{
    phone = '13912345678'
    password = 'password123'
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' `
        -Method POST `
        -Body $loginBody `
        -ContentType 'application/json' `
        -UseBasicParsing
    
    Write-Host "登录成功!" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "Token: $($loginData.token)" -ForegroundColor Cyan
    Write-Host "用户名: $($loginData.username)" -ForegroundColor Cyan
    Write-Host "手机号: $($loginData.phone)" -ForegroundColor Cyan
} catch {
    Write-Host "登录失败: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n测试 3: 获取用户信息" -ForegroundColor Green
try {
    $profileResponse = Invoke-WebRequest -Uri 'http://localhost:8080/api/user/profile' `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" } `
        -UseBasicParsing
    
    Write-Host "获取用户信息成功!" -ForegroundColor Green
    $profileData = $profileResponse.Content | ConvertFrom-Json
    Write-Host ($profileData | ConvertTo-Json) -ForegroundColor Cyan
} catch {
    Write-Host "获取用户信息失败: $_" -ForegroundColor Red
}

Write-Host "`n所有测试完成!" -ForegroundColor Green
