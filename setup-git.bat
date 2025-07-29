@echo off
echo 🚀 Setting up Git repository for Brett on Bonk website...
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Initialize Git repository
echo 📁 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)

REM Add all files
echo 📝 Adding files to repository...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)

REM Initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: Brett on Bonk website"
if %errorlevel% neq 0 (
    echo ❌ Failed to create initial commit
    pause
    exit /b 1
)

echo.
echo ✅ Git repository setup complete!
echo.
echo 📋 Next steps:
echo 1. Create a new repository on GitHub
echo 2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo 3. Run: git push -u origin main
echo 4. Connect your GitHub repo to Netlify for automatic deployments
echo.
echo 🎉 Your website is now ready for real-time updates!
pause 