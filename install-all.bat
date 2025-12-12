@echo off
echo ========================================
echo   GoTrip - Complete Installation
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Running without administrator privileges
    echo Some features may not work properly
    echo.
)

echo Step 1: Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed!
    echo Please install Java 17 or higher from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)
echo [OK] Java is installed

REM Check if Tomcat download exists
if not exist "C:\Users\User\Downloads\apache-tomcat-10.1.30.zip" (
    echo.
    echo [INFO] Tomcat not found in Downloads
    echo Please wait while I download it...
    echo This may take a few minutes...
    echo.
    
    REM Download using PowerShell
    powershell -Command "& {Invoke-WebRequest -Uri 'https://archive.apache.org/dist/tomcat/tomcat-10/v10.1.30/bin/apache-tomcat-10.1.30-windows-x64.zip' -OutFile 'C:\Users\User\Downloads\apache-tomcat-10.1.30.zip'}"
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to download Tomcat
        echo Please download manually from: https://tomcat.apache.org/download-10.cgi
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Installing Apache Tomcat...
echo.

REM Extract Tomcat
if not exist "C:\apache-tomcat" (
    echo Extracting Tomcat to C:\apache-tomcat...
    powershell -Command "& {Expand-Archive -Path 'C:\Users\User\Downloads\apache-tomcat-10.1.30.zip' -DestinationPath 'C:\' -Force}"
    
    REM Rename folder
    if exist "C:\apache-tomcat-10.1.30" (
        move "C:\apache-tomcat-10.1.30" "C:\apache-tomcat" >nul 2>&1
    )
    
    echo [OK] Tomcat installed to C:\apache-tomcat
) else (
    echo [OK] Tomcat already installed
)

echo.
echo Step 3: Checking MySQL...
echo.

where mysql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MySQL is not installed
    echo.
    echo Please install MySQL manually:
    echo 1. Download from: https://dev.mysql.com/downloads/installer/
    echo 2. Run the installer
    echo 3. Choose "Developer Default" setup
    echo 4. Set root password (remember it!)
    echo 5. Complete the installation
    echo.
    echo After installing MySQL, run: setup-database.bat
    echo.
) else (
    echo [OK] MySQL is installed
    echo.
    echo Setting up database...
    call setup-database.bat
)

echo.
echo ========================================
echo   Installation Summary
echo ========================================
echo.
echo [OK] Java: Installed
echo [OK] Tomcat: C:\apache-tomcat
if exist "C:\Program Files\MySQL" (
    echo [OK] MySQL: Installed
) else (
    echo [!] MySQL: Please install manually
)
echo.
echo Next steps:
echo 1. Configure Tomcat in your IDE
echo 2. Run the GoTrip application
echo.
echo See: how_to_run.md for detailed instructions
echo.
pause
