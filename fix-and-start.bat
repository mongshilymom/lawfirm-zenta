@echo off
echo ==========================================
echo 🔧 빠른 수정 + 재시작
echo ==========================================
echo.

echo [1/3] 캐시 클리어 중...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next 폴더 삭제 완료
)

if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules 캐시 삭제 완료
)

echo.
echo [2/3] 포트 확인 및 기존 프로세스 종료...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /PID %%a /F 2>nul
)
echo ✅ 포트 3000 정리 완료

echo.
echo [3/3] 개발 서버 시작...
echo.
echo ==========================================
echo 접속 주소: http://localhost:3000
echo ==========================================
echo.

npm run dev
