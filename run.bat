@echo off
REM Navigate to the Backend directory and run the command
cd /d "X:\Projects\MatriyanX\api"
start cmd /k "venv\Scripts\activate"

REM Navigate to the Frontend directory and run the command
cd /d "X:\Projects\MatriyanX\frontend"
start cmd /k "npm run dev"
