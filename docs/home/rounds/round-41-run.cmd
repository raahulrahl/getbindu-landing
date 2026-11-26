@echo off
rem Round 41 scheduled run (Windows Task Scheduler, once). Fresh headless Claude session on Sonnet.
cd /d C:\Users\HP\bindu\getbindu-landing
"C:\Users\HP\.local\bin\claude.exe" -p "Follow docs/home/rounds/round-41-run.md exactly." --model sonnet --permission-mode acceptEdits --allowedTools "Bash Read Edit Write Glob Grep Skill" > "C:\Users\HP\bindu\r41-run.log" 2>&1
