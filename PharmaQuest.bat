@echo off
echo Starting PharmaQuest RPG...
echo Please wait while the game loads...
python PharmaQuest.py
if errorlevel 1 (
    echo.
    echo Error running the game. Please make sure Python is installed correctly.
    echo Visit https://www.python.org/downloads/ to download and install Python.
    pause
    exit /b 1
)
pause
