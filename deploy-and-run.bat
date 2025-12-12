@echo off
echo ========================================
echo   GoTrip - Deploy and Run
echo ========================================
echo.

REM Check if Tomcat is installed
if not exist "C:\apache-tomcat\bin\startup.bat" (
    echo [ERROR] Tomcat not found at C:\apache-tomcat
    echo Please run: install-all.bat first
    pause
    exit /b 1
)

echo Step 1: Stopping Tomcat (if running)...
call "C:\apache-tomcat\bin\shutdown.bat" >nul 2>&1
timeout /t 3 /nobreak >nul

echo Step 2: Cleaning old deployment...
if exist "C:\apache-tomcat\webapps\GoTrip" (
    rmdir /s /q "C:\apache-tomcat\webapps\GoTrip"
)
if exist "C:\apache-tomcat\webapps\GoTrip.war" (
    del /f "C:\apache-tomcat\webapps\GoTrip.war"
)

echo Step 3: Copying application files...
xcopy /E /I /Y "WebContent" "C:\apache-tomcat\webapps\GoTrip" >nul

REM Create WEB-INF structure
if not exist "C:\apache-tomcat\webapps\GoTrip\WEB-INF\classes" (
    mkdir "C:\apache-tomcat\webapps\GoTrip\WEB-INF\classes"
)

echo Step 4: Compiling Java files...
javac -cp "WebContent\WEB-INF\lib\*" -d "C:\apache-tomcat\webapps\GoTrip\WEB-INF\classes" src\main\java\com\slayscreens\**\*.java

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed
    echo Please check your Java files for errors
    pause
    exit /b 1
)

echo [OK] Compilation successful

echo Step 5: Starting Tomcat...
start "Tomcat Server" "C:\apache-tomcat\bin\startup.bat"

echo.
echo ========================================
echo   Application Deployed!
echo ========================================
echo.
echo Tomcat is starting...
echo Wait 10 seconds, then access:
echo.
echo   Home: http://localhost:8080/GoTrip/index.html
echo   Admin: http://localhost:8080/GoTrip/admin/dashboard.html
echo.
echo To stop Tomcat: C:\apache-tomcat\bin\shutdown.bat
echo.
pause
