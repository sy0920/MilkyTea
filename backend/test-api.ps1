# MilkyTea Backend API Test Script
# Usage: .\test-api.ps1

$baseUrl = "http://localhost:8080"
$token = ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MilkyTea Backend API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test if service is running
Write-Host "1. Checking service status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/swagger-ui.html" -Method Get -ErrorAction Stop -TimeoutSec 5
    Write-Host "[OK] Service is running" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Service not running. Please start: mvn spring-boot:run" -ForegroundColor Red
    exit
}
Write-Host ""

# Test user registration
Write-Host "2. Testing user registration..." -ForegroundColor Yellow
$registerData = @{
    username = "testuser_$(Get-Random -Maximum 9999)"
    email = "test_$(Get-Random -Maximum 9999)@example.com"
    password = "test123456"
    nickname = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    $token = $response.token
    Write-Host "[OK] Registration successful" -ForegroundColor Green
    Write-Host "  User ID: $($response.userId)" -ForegroundColor Gray
    Write-Host "  Username: $($response.username)" -ForegroundColor Gray
    $testUsername = $response.username
} catch {
    Write-Host "[FAIL] Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test user login
Write-Host "3. Testing user login..." -ForegroundColor Yellow
$loginData = @{
    username = $testUsername
    password = "test123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "[OK] Login successful" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test get user profile
Write-Host "4. Testing get user profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/user/profile" -Method Get -Headers $headers
    Write-Host "[OK] Get profile successful" -ForegroundColor Green
    Write-Host "  Nickname: $($profile.nickname)" -ForegroundColor Gray
    Write-Host "  Email: $($profile.email)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Get profile failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test get brands (public endpoint)
Write-Host "5. Testing get brands list (public)..." -ForegroundColor Yellow
try {
    $brands = Invoke-RestMethod -Uri "$baseUrl/api/brands" -Method Get
    Write-Host "[OK] Get brands successful, total: $($brands.Count)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Get brands failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test create brand
Write-Host "6. Testing create brand..." -ForegroundColor Yellow
$brandData = @{
    name = "Test Brand $(Get-Random -Maximum 9999)"
    description = "Auto-generated test brand"
    logoUrl = "https://example.com/logo.png"
} | ConvertTo-Json

try {
    $brand = Invoke-RestMethod -Uri "$baseUrl/api/brands" -Method Post -Body $brandData -ContentType "application/json" -Headers $headers
    Write-Host "[OK] Create brand successful" -ForegroundColor Green
    Write-Host "  Brand ID: $($brand.id)" -ForegroundColor Gray
    Write-Host "  Brand Name: $($brand.name)" -ForegroundColor Gray
    $brandId = $brand.id
} catch {
    Write-Host "[FAIL] Create brand failed: $($_.Exception.Message)" -ForegroundColor Red
    $brandId = 1
}
Write-Host ""

# Test create record
Write-Host "7. Testing create milk tea record..." -ForegroundColor Yellow
$recordData = @{
    brandId = $brandId
    category = "Bubble Tea"
    sweetness = "Half Sugar"
    iceLevel = "Less Ice"
    price = 18.5
    rating = 8
    comment = "Test record, very good"
    consumeDate = (Get-Date -Format "yyyy-MM-dd")
} | ConvertTo-Json

try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Post -Body $recordData -ContentType "application/json" -Headers $headers
    Write-Host "[OK] Create record successful" -ForegroundColor Green
    Write-Host "  Record ID: $($record.id)" -ForegroundColor Gray
    Write-Host "  Brand: $($record.brandName)" -ForegroundColor Gray
    Write-Host "  Rating: $($record.rating)/10" -ForegroundColor Gray
    $recordId = $record.id
} catch {
    Write-Host "[FAIL] Create record failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test get records
Write-Host "8. Testing get records list..." -ForegroundColor Yellow
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Get -Headers $headers
    Write-Host "[OK] Get records successful, total: $($records.Count)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Get records failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test get statistics
Write-Host "9. Testing get statistics..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/api/statistics/summary" -Method Get -Headers $headers
    Write-Host "[OK] Get statistics successful" -ForegroundColor Green
    Write-Host "  Total Cups: $($stats.totalCups)" -ForegroundColor Gray
    Write-Host "  Total Amount: $($stats.totalAmount)" -ForegroundColor Gray
    Write-Host "  Average Rating: $($stats.averageRating)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Get statistics failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Other test methods:" -ForegroundColor Yellow
Write-Host "- Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor Gray
Write-Host "- H2 Console: http://localhost:8080/h2-console" -ForegroundColor Gray
Write-Host "  JDBC URL: jdbc:h2:file:./data/milkytea" -ForegroundColor Gray
Write-Host "  Username: sa" -ForegroundColor Gray
Write-Host "  Password: (empty)" -ForegroundColor Gray
