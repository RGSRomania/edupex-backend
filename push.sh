#!/bin/bash

cd /Users/mdica/PycharmProjects/EduPex/backend

echo "=== Git Status ===" > /tmp/git_push.log
git status >> /tmp/git_push.log 2>&1

echo "" >> /tmp/git_push.log
echo "=== Git Log ===" >> /tmp/git_push.log
git log --oneline >> /tmp/git_push.log 2>&1

echo "" >> /tmp/git_push.log
echo "=== Git Remote ===" >> /tmp/git_push.log
git remote -v >> /tmp/git_push.log 2>&1

echo "" >> /tmp/git_push.log
echo "=== Pushing to GitHub ===" >> /tmp/git_push.log
git push -f origin main >> /tmp/git_push.log 2>&1

echo "" >> /tmp/git_push.log
echo "=== Push Complete ===" >> /tmp/git_push.log
cat /tmp/git_push.log

