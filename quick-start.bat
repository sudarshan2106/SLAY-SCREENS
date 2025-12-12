@echo off
echo ========================================
echo   Quick Start - GoTrip (No Database)
echo ========================================
echo.

REM Set JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-25
set PATH=%JAVA_HOME%\bin;%PATH%

echo [OK] Java configured: %JAVA_HOME%
echo.

REM Check Tomcat
if not exist "C:\apache-tomcat\bin\startup.bat" (
    echo [ERROR] Tomcat not installed!
    echo Run: install-all.bat
    pause
    exit /b 1
)

echo Step 1: Copying HTML files to Tomcat...
if not exist "C:\apache-tomcat\webapps\GoTrip" (
    mkdir "C:\apache-tomcat\webapps\GoTrip"
)

xcopy /E /I /Y "WebContent\*" "C:\apache-tomcat\webapps\GoTrip\" >nul
echo [OK] Files copied

echo.
echo Step 2: Starting Tomcat...
cd "C:\apache-tomcat\bin"
call startup.bat

echo.
echo ========================================
echo   Server Starting!
echo ========================================
echo.
echo Waiting 10 seconds for Tomcat to start...
timeout /t 10 /nobreak >nul

echo.
echo Opening browser...
start http://localhost:8080/GoTrip/index.html

echo.
echo ========================================
echo   Access Your Application:
echo ========================================
echo.
echo   Home:  http://localhost:8080/GoTrip/index.html
echo   Login: http://localhost:8080/GoTrip/login.html
echo.
echo NOTE: Backend features (login, bookings) won't work
echo until you install MySQL and run setup-database.bat
echo.
echo To stop server: C:\apache-tomcat\bin\shutdown.bat
echo.
pause
