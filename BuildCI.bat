call Build.bat
xcopy dist ..\Builded /y /s
cd ..\Builded
copy index.html 404.html
set x=%date:~0,4%%date:~5,2%%date:~8,2%
set y=%time:~0,2%%time:~3,2%%time:~6,2%
git pull
git add .
git commit -m "Fast git push on %x%-%y%"
git push
pause