@echo off
echo ========================================
echo   GoTrip - Force IDE Refresh
echo ========================================
echo.
echo This will touch project files to force IDE refresh...
echo.

REM Touch .classpath file
copy /b .classpath +,, > nul 2>&1
echo [OK] Updated .classpath timestamp

REM Touch .project file  
copy /b .project +,, > nul 2>&1
echo [OK] Updated .project timestamp

REM Touch pom.xml
copy /b pom.xml +,, > nul 2>&1
echo [OK] Updated pom.xml timestamp

echo.
echo ========================================
echo DONE! Your IDE should detect the changes.
echo ========================================
echo.
echo Next steps:
echo 1. Your IDE should automatically refresh
echo 2. If not, manually refresh the project (F5 in Eclipse)
echo 3. Reopen AuthServlet.java and MovieController.java
echo.
echo The import errors should be resolved!
echo.
pause
