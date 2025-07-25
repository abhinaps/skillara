try {
    $filePath = "test-resume.txt"
    $uri = "http://localhost:4000/api/upload"

    # Read file content
    $fileContent = [System.IO.File]::ReadAllBytes($filePath)
    $fileName = [System.IO.Path]::GetFileName($filePath)

    # Create multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: text/plain$LF",
        [System.Text.Encoding]::ASCII.GetString($fileContent),
        "--$boundary--$LF"
    ) -join $LF

    $headers = @{
        "X-Session-Id" = "test-session"
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }

    Write-Host "Testing file upload to backend API..."
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $bodyLines -Headers $headers

    Write-Host "✅ Upload successful!"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"

} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}
