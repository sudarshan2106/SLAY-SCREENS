@echo off
echo ========================================
echo   Starting GoTrip Application
echo ========================================
echo.

REM Check if Tomcat exists
if not exist "C:\apache-tomcat\bin\startup.bat" (
    echo [ERROR] Tomcat not found!
    echo Please run: install-all.bat first
    pause
    exit /b 1
)

echo Step 1: Starting Tomcat Server...
echo.

REM Start Tomcat
cd "C:\apache-tomcat\bin"
start "Tomcat Server" startup.bat

echo [OK] Tomcat is starting...
echo.
echo Please wait 15 seconds for Tomcat to fully start...
timeout /t 15 /nobreak

echo.
echo ========================================
echo   Server Started!
echo ========================================
echo.
echo You can now access your application:
echo.
echo   Tomcat Home: http://localhost:8080
echo   GoTrip App:  http://localhost:8080/GoTrip/
echo.
echo NOTE: If you see errors, you may need to:
echo 1. Install MySQL (see mysql_installation.md)
echo 2. Run setup-database.bat
echo 3. Deploy your app with deploy-and-run.bat
echo.
echo To stop Tomcat: C:\apache-tomcat\bin\shutdown.bat
echo.

REM Open browser
start http://localhost:8080

pause
