# Test Registration with detailed error
$baseUrl = "http://localhost:8080"

Write-Host "Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser9999"
    phone = "13812345678"
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Request Body:"
Write-Host $registerBody

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    
    $result = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($result)
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body:"
    Write-Host $responseBody
}
