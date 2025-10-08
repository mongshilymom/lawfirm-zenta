@echo off
echo ==========================================
echo Template Law Firm Zenta - Quick Fix
echo ==========================================
echo.

echo [1/4] 환경변수 확인 중...
if not exist .env (
    echo ❌ .env 파일이 없습니다!
    pause
    exit /b 1
)
echo ✅ .env 파일 존재

echo.
echo [2/4] node_modules 확인 중...
if not exist node_modules (
    echo ❌ node_modules가 없습니다. npm install을 실행합니다...
    call npm install
)
echo ✅ node_modules 존재

echo.
echo [3/4] 포트 3000 확인 중...
netstat -ano | findstr :3000
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  포트 3000이 이미 사용 중입니다.
    echo    다른 포트(3001)로 시작합니다...
    set PORT=3001
) else (
    echo ✅ 포트 3000 사용 가능
    set PORT=3000
)

echo.
echo [4/4] 개발 서버 시작...
echo.
echo ==========================================
echo 접속 주소: http://localhost:%PORT%
echo ==========================================
echo.

npm run dev -- -p %PORT%
