# Test with random values
$baseUrl = "http://localhost:8080"

Write-Host "Testing Registration with Random Data..." -ForegroundColor Yellow
$randomNum = Get-Random -Minimum 100000 -Maximum 999999
$registerBody = @{
    username = "user$randomNum"
    phone = "138$(Get-Random -Minimum 10000000 -Maximum 99999999)"
    password = "Pass123456"
} | ConvertTo-Json

Write-Host "Request Body:"
Write-Host $registerBody

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "`nSUCCESS!" -ForegroundColor Green
    Write-Host "UserId: $($response.userId)"
    Write-Host "Username: $($response.username)"
    Write-Host "Phone: $($response.phone)"
    Write-Host "Token: $($response.token.Substring(0,30))..."
} catch {
    Write-Host "`nFAILED!" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        $result = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($result)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response:"
        Write-Host $responseBody
    } else {
        Write-Host "Error: $($_.Exception.Message)"
    }
}
