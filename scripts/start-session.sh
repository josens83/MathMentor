#!/bin/bash

# MathMentor Development Session Starter
# 4단계 워크플로우의 시작점

set -e

echo "🚀 MathMentor 개발 세션 시작"
echo "================================"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Git 상태 확인
echo -e "\n${BLUE}📋 Git 상태 확인${NC}"
echo "--------------------------------"
BRANCH=$(git branch --show-current)
echo "현재 브랜치: $BRANCH"

if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  커밋되지 않은 변경사항이 있습니다${NC}"
    git status --short
else
    echo -e "${GREEN}✅ 작업 디렉토리가 깨끗합니다${NC}"
fi

# 2. 의존성 확인
echo -e "\n${BLUE}📦 의존성 확인${NC}"
echo "--------------------------------"
if [ -f "node_modules/.package-lock.json" ]; then
    # package.json과 lock 파일 비교
    PKG_HASH=$(md5sum package.json | cut -d' ' -f1)
    if [ -f ".npm-hash" ]; then
        STORED_HASH=$(cat .npm-hash)
        if [ "$PKG_HASH" != "$STORED_HASH" ]; then
            echo -e "${YELLOW}⚠️  package.json이 변경되었습니다. npm install 실행...${NC}"
            npm install
            echo "$PKG_HASH" > .npm-hash
        else
            echo -e "${GREEN}✅ 의존성이 최신 상태입니다${NC}"
        fi
    else
        echo "$PKG_HASH" > .npm-hash
        echo -e "${GREEN}✅ 해시 파일 생성됨${NC}"
    fi
else
    echo -e "${YELLOW}📥 node_modules가 없습니다. npm install 실행...${NC}"
    npm install
fi

# 3. TypeScript 타입 체크
echo -e "\n${BLUE}🔍 TypeScript 타입 체크${NC}"
echo "--------------------------------"
if npm run typecheck 2>/dev/null; then
    echo -e "${GREEN}✅ 타입 체크 통과${NC}"
else
    echo -e "${RED}❌ 타입 에러가 있습니다${NC}"
    echo "npm run typecheck로 상세 내용을 확인하세요"
fi

# 4. 테스트 실행
echo -e "\n${BLUE}🧪 테스트 실행${NC}"
echo "--------------------------------"
if npm run test:run 2>/dev/null; then
    echo -e "${GREEN}✅ 모든 테스트 통과${NC}"
else
    echo -e "${RED}❌ 실패한 테스트가 있습니다${NC}"
    echo "npm run test로 상세 내용을 확인하세요"
fi

# 5. 린트 체크
echo -e "\n${BLUE}📝 린트 체크${NC}"
echo "--------------------------------"
if npm run lint 2>/dev/null; then
    echo -e "${GREEN}✅ 린트 통과${NC}"
else
    echo -e "${YELLOW}⚠️  린트 경고/에러가 있습니다${NC}"
fi

# 6. 환경 변수 확인
echo -e "\n${BLUE}🔐 환경 변수 확인${NC}"
echo "--------------------------------"
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)

OPTIONAL_VARS=(
    "SUPABASE_SERVICE_ROLE_KEY"
    "ANTHROPIC_API_KEY"
    "STRIPE_SECRET_KEY"
)

if [ -f ".env.local" ]; then
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.local; then
            echo -e "${GREEN}✅ $var${NC}"
        else
            echo -e "${RED}❌ $var (필수)${NC}"
        fi
    done

    for var in "${OPTIONAL_VARS[@]}"; do
        if grep -q "^$var=" .env.local; then
            echo -e "${GREEN}✅ $var${NC}"
        else
            echo -e "${YELLOW}⚠️  $var (선택)${NC}"
        fi
    done
else
    echo -e "${YELLOW}⚠️  .env.local 파일이 없습니다${NC}"
    echo "cp .env.example .env.local로 생성하세요"
fi

# 7. 최근 커밋 표시
echo -e "\n${BLUE}📜 최근 커밋 (5개)${NC}"
echo "--------------------------------"
git log --oneline -5

# 8. 세션 요약
echo -e "\n${BLUE}================================${NC}"
echo -e "${GREEN}🎯 개발 준비 완료!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "📚 4단계 워크플로우:"
echo "  1️⃣  Explore - 코드베이스 탐색"
echo "  2️⃣  Plan    - 구현 계획 수립"
echo "  3️⃣  Code    - Vertical Slice 구현"
echo "  4️⃣  Commit  - 테스트 및 커밋"
echo ""
echo "💡 유용한 명령어:"
echo "  npm run dev        - 개발 서버 시작"
echo "  npm run test       - 테스트 실행 (watch 모드)"
echo "  npm run typecheck  - 타입 체크"
echo ""
echo "🔗 프롬프트 템플릿: .claude/prompts/"
echo "📋 프로젝트 가이드: CLAUDE.md"
