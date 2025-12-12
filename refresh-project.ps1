# GoTrip Project - IDE Refresh Script
# This script helps verify and refresh your project configuration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GoTrip Project Configuration Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if JARs exist
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$jars = @(
    "WebContent\WEB-INF\lib\javax.servlet-api-3.1.0.jar",
    "WebContent\WEB-INF\lib\gson-2.8.9.jar",
    "WebContent\WEB-INF\lib\mysql-connector-j-8.0.33.jar"
)

$allJarsPresent = $true
foreach ($jar in $jars) {
    if (Test-Path $jar) {
        Write-Host "  ✓ Found: $jar" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Missing: $jar" -ForegroundColor Red
        $allJarsPresent = $false
    }
}

Write-Host ""

# Check configuration files
Write-Host "Checking configuration files..." -ForegroundColor Yellow
$configFiles = @(
    ".classpath",
    ".project",
    "pom.xml",
    ".settings\org.eclipse.jdt.core.prefs"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Missing: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allJarsPresent) {
    Write-Host "✅ All dependencies are present!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Close all Java files in your IDE" -ForegroundColor White
    Write-Host "2. Right-click 'GoTrip' project → Refresh (F5)" -ForegroundColor White
    Write-Host "3. Project → Clean... → Clean All Projects" -ForegroundColor White
    Write-Host "4. Reopen AuthServlet.java and MovieController.java" -ForegroundColor White
    Write-Host ""
    Write-Host "The import errors should be gone!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some dependencies are missing!" -ForegroundColor Red
    Write-Host "Please run the setup again." -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
