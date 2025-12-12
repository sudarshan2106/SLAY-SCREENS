@echo off
echo ========================================
echo   GoTrip - Quick Setup Database
echo ========================================
echo.

REM Check if MySQL is installed
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MySQL is not installed or not in PATH
    echo Please install MySQL from: https://dev.mysql.com/downloads/mysql/
    echo.
    pause
    exit /b 1
)

echo [OK] MySQL found!
echo.

REM Prompt for MySQL password
set /p MYSQL_PASSWORD="Enter your MySQL root password: "

echo.
echo Creating database and tables...
echo.

REM Run the SQL script
mysql -u root -p%MYSQL_PASSWORD% < "src\main\resources\database.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Database setup complete
    echo ========================================
    echo.
    echo Database: slayscreens
    echo Tables created: users, movies, theatres, shows, bookings
    echo.
    echo Default users created:
    echo   Admin: admin@slayscreens.com / admin123
    echo   User:  user@slayscreens.com / user123
    echo.
) else (
    echo.
    echo [ERROR] Failed to create database
    echo Please check your MySQL password and try again
    echo.
)

pause
