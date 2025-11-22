# MilkyTea API Test Script
# Encoding: UTF-8

$baseUrl = "http://localhost:8080"
$token = ""
$testPassword = "Test123456"  # Initial password for all tests
$testPhone = ""  # Will be set after registration

Write-Host "========================================"
Write-Host "MilkyTea API Complete Test"
Write-Host "========================================"
Write-Host ""

# 1. Register
Write-Host "1. Testing Register (POST /api/auth/register)"
$registerBody = @{
    username = "testuser$(Get-Random -Minimum 1000 -Maximum 9999)"
    phone = "138$(Get-Random -Minimum 10000000 -Maximum 99999999)"
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "SUCCESS - Registered" -ForegroundColor Green
    Write-Host "  UserID: $($response.userId)"
    Write-Host "  Username: $($response.username)"
    Write-Host "  Phone: $($response.phone)"
    $token = $response.token
    $username = $response.username
    $phone = $response.phone
    $testPhone = $response.phone  # Save for re-login
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. Login
Write-Host "2. Testing Login (POST /api/auth/login)"
$loginBody = @{
    phone = $phone
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "SUCCESS - Logged in" -ForegroundColor Green
    $token = $response.token
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Get Profile
Write-Host "3. Testing Get Profile (GET /api/user/profile)"
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user/profile" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got profile" -ForegroundColor Green
    Write-Host "  Username: $($response.username)"
    Write-Host "  Phone: $($response.phone)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Update Profile
Write-Host "4. Testing Update Profile (PUT /api/user/profile)"
$updateBody = @{
    avatar = "https://example.com/avatar.jpg"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user/profile" -Method Put -Body $updateBody -Headers $headers
    Write-Host "SUCCESS - Updated profile" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Update Username
Write-Host "5. Testing Update Username (PATCH /api/user/username)"
$newUsername = "newuser$(Get-Random -Minimum 1000 -Maximum 9999)"
$usernameBody = @{
    newUsername = $newUsername
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/user/username" -Method Patch -Body $usernameBody -Headers $headers
    Write-Host "SUCCESS - Updated username" -ForegroundColor Green
    Write-Host "  New Username: $($response.username)"
    
    # Re-login after username change to get fresh token
    Write-Host "  Re-logging in after username change..." -ForegroundColor Yellow
    $reloginBody = @{
        phone = $testPhone
        password = $testPassword
    } | ConvertTo-Json
    
    $loginResponse2 = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $reloginBody -Headers @{"Content-Type"="application/json"}
    $token = $loginResponse2.token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    Write-Host "  Successfully re-logged in" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 6. Change Password
Write-Host "6. Testing Change Password (POST /api/user/change-password)"
$newPassword = "NewPass123"
$passwordBody = @{
    oldPassword = $testPassword
    newPassword = $newPassword
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/user/change-password" -Method Post -Body $passwordBody -Headers $headers
    Write-Host "SUCCESS - Changed password" -ForegroundColor Green
    $testPassword = $newPassword  # Update password for future logins
    
    # Re-login with new password to get fresh token
    Write-Host "  Re-logging in with new password..." -ForegroundColor Yellow
    $newLoginBody = @{
        phone = $testPhone
        password = $testPassword
    } | ConvertTo-Json
    
    $loginResponse2 = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $newLoginBody -Headers @{"Content-Type"="application/json"}
    $token = $loginResponse2.token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    Write-Host "  Successfully re-logged in" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 7. Create Brand
Write-Host "7. Testing Create Brand (POST /api/brands)"
$brandBody = @{
    name = "TestBrand$(Get-Random -Minimum 100 -Maximum 999)"
    description = "Test Brand Description"
    logoUrl = "https://example.com/logo.png"
} | ConvertTo-Json

try {
    $brand = Invoke-RestMethod -Uri "$baseUrl/api/brands" -Method Post -Body $brandBody -Headers $headers
    Write-Host "SUCCESS - Created brand" -ForegroundColor Green
    Write-Host "  Brand ID: $($brand.id)"
    Write-Host "  Brand Name: $($brand.name)"
    $brandId = $brand.id
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 8. Get All Brands
Write-Host "8. Testing Get All Brands (GET /api/brands)"
try {
    $brands = Invoke-RestMethod -Uri "$baseUrl/api/brands" -Method Get
    Write-Host "SUCCESS - Got brands" -ForegroundColor Green
    Write-Host "  Total Brands: $($brands.Count)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 9. Get Brand Detail
Write-Host "9. Testing Get Brand Detail (GET /api/brands/{id})"
try {
    $brand = Invoke-RestMethod -Uri "$baseUrl/api/brands/$brandId" -Method Get
    Write-Host "SUCCESS - Got brand detail" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 10. Create Record
Write-Host "10. Testing Create Record (POST /api/records)"
$date = Get-Date -Format "yyyy-MM-dd"
$recordBody = @{
    brandId = $brandId
    category = "Bubble Tea"
    sweetness = "Half Sugar"
    iceLevel = "Less Ice"
    price = 18.50
    rating = 8
    comment = "Very good"
    consumeDate = $date
} | ConvertTo-Json

try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Post -Body $recordBody -Headers $headers
    Write-Host "SUCCESS - Created record" -ForegroundColor Green
    Write-Host "  Record ID: $($record.id)"
    $recordId = $record.id
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 11. Get All Records
Write-Host "11. Testing Get All Records (GET /api/records)"
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got records" -ForegroundColor Green
    Write-Host "  Total Records: $($records.Count)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 12. Filter Records by Date
Write-Host "12. Testing Filter Records by Date"
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records?date=$date" -Method Get -Headers $headers
    Write-Host "SUCCESS - Filtered by date" -ForegroundColor Green
    Write-Host "  Today Records: $($records.Count)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 13. Filter Records by Brand
Write-Host "13. Testing Filter Records by Brand"
try {
    $records = Invoke-RestMethod -Uri "$baseUrl/api/records?brandId=$brandId" -Method Get -Headers $headers
    Write-Host "SUCCESS - Filtered by brand" -ForegroundColor Green
    Write-Host "  Brand Records: $($records.Count)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 14. Get Record Detail
Write-Host "14. Testing Get Record Detail (GET /api/records/{id})"
try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records/$recordId" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got record detail" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 15. Update Record
Write-Host "15. Testing Update Record (PUT /api/records/{id})"
$updateRecordBody = @{
    rating = 9
    comment = "Updated comment - Excellent!"
} | ConvertTo-Json

try {
    $record = Invoke-RestMethod -Uri "$baseUrl/api/records/$recordId" -Method Put -Body $updateRecordBody -Headers $headers
    Write-Host "SUCCESS - Updated record" -ForegroundColor Green
    Write-Host "  New Rating: $($record.rating)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 16. Create More Records for Batch Delete
Write-Host "16. Creating More Records for Testing"
$recordIds = @($recordId)
for ($i = 0; $i -lt 2; $i++) {
    $testBody = @{
        brandId = $brandId
        category = "Test$i"
        sweetness = "Half"
        iceLevel = "Less"
        price = 15.00
        rating = 7
    } | ConvertTo-Json
    
    try {
        $testRecord = Invoke-RestMethod -Uri "$baseUrl/api/records" -Method Post -Body $testBody -Headers $headers
        $recordIds += $testRecord.id
        Write-Host "  Created test record $($i+1): ID=$($testRecord.id)" -ForegroundColor Gray
    } catch {
        Write-Host "  Failed to create test record" -ForegroundColor Red
    }
}
Write-Host ""

# 17. Batch Delete Records
Write-Host "17. Testing Batch Delete (POST /api/records/batch-delete)"
$batchBody = @{
    ids = @($recordIds[1], $recordIds[2])
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/api/records/batch-delete" -Method Post -Body $batchBody -Headers $headers
    Write-Host "SUCCESS - Batch deleted 2 records" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 18. Get Statistics Summary
Write-Host "18. Testing Get Statistics Summary (GET /api/statistics/summary)"
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/api/statistics/summary" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got statistics" -ForegroundColor Green
    Write-Host "  Total Cups: $($stats.totalCups)"
    Write-Host "  Total Amount: $($stats.totalAmount)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 19. Get Brand Statistics
Write-Host "19. Testing Get Brand Statistics (GET /api/statistics/brands)"
try {
    $brandStats = Invoke-RestMethod -Uri "$baseUrl/api/statistics/brands" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got brand statistics" -ForegroundColor Green
    Write-Host "  Brands Count: $($brandStats.statistics.Count)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 20. Get Trends Analysis
Write-Host "20. Testing Get Trends Analysis (GET /api/statistics/trends)"
try {
    $trends = Invoke-RestMethod -Uri "$baseUrl/api/statistics/trends?groupBy=day" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got trends" -ForegroundColor Green
    Write-Host "  Group By: $($trends.groupBy)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 21. Get Calendar Data
Write-Host "21. Testing Get Calendar Data (GET /api/statistics/calendar/{year}/{month})"
$year = (Get-Date).Year
$month = (Get-Date).Month
try {
    $calendar = Invoke-RestMethod -Uri "$baseUrl/api/statistics/calendar/$year/$month" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got calendar data" -ForegroundColor Green
    Write-Host "  Year-Month: $($calendar.year)-$($calendar.month)"
    Write-Host "  Total Cups: $($calendar.totalCups)"
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 22. Delete Record
Write-Host "22. Testing Delete Record (DELETE /api/records/{id})"
try {
    Invoke-RestMethod -Uri "$baseUrl/api/records/$recordId" -Method Delete -Headers $headers
    Write-Host "SUCCESS - Deleted record" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 23. Delete Brand
Write-Host "23. Testing Delete Brand (DELETE /api/brands/{id})"
try {
    Invoke-RestMethod -Uri "$baseUrl/api/brands/$brandId" -Method Delete -Headers $headers
    Write-Host "SUCCESS - Deleted brand" -ForegroundColor Green
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================"
Write-Host "All Tests Completed!"
Write-Host "========================================"
