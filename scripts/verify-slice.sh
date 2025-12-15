#!/bin/bash

# MathMentor Vertical Slice Verification Script
# Vertical Slice 구현 완료 후 검증용

set -e

echo "🔍 Vertical Slice 검증"
echo "================================"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 결과 추적
PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARN++))
}

# 1. TypeScript 타입 체크
echo -e "\n${BLUE}1️⃣  TypeScript 타입 체크${NC}"
echo "--------------------------------"
if npm run typecheck 2>&1 | tail -1 | grep -q "error"; then
    check_fail "타입 에러가 있습니다"
    echo "   실행: npm run typecheck"
else
    check_pass "타입 체크 통과"
fi

# 2. 테스트 실행
echo -e "\n${BLUE}2️⃣  테스트 실행${NC}"
echo "--------------------------------"
TEST_OUTPUT=$(npm run test:run 2>&1)
if echo "$TEST_OUTPUT" | grep -q "failed"; then
    check_fail "실패한 테스트가 있습니다"
    echo "   실행: npm run test"
else
    TESTS_PASSED=$(echo "$TEST_OUTPUT" | grep -oP '\d+(?= passed)' | head -1)
    check_pass "테스트 통과 (${TESTS_PASSED:-0}개)"
fi

# 3. 린트 체크
echo -e "\n${BLUE}3️⃣  린트 체크${NC}"
echo "--------------------------------"
LINT_OUTPUT=$(npm run lint 2>&1)
if echo "$LINT_OUTPUT" | grep -q "error"; then
    check_fail "린트 에러가 있습니다"
elif echo "$LINT_OUTPUT" | grep -q "warning"; then
    check_warn "린트 경고가 있습니다"
else
    check_pass "린트 통과"
fi

# 4. 빌드 체크
echo -e "\n${BLUE}4️⃣  빌드 체크${NC}"
echo "--------------------------------"
if npm run build 2>&1 | grep -q "error"; then
    check_fail "빌드 에러가 있습니다"
else
    check_pass "빌드 성공"
fi

# 5. 변경된 파일 분석
echo -e "\n${BLUE}5️⃣  변경된 파일 분석${NC}"
echo "--------------------------------"

# 스테이지되지 않은 변경사항
UNSTAGED=$(git diff --name-only)
# 스테이지된 변경사항
STAGED=$(git diff --cached --name-only)
# 추적되지 않은 파일
UNTRACKED=$(git ls-files --others --exclude-standard)

ALL_CHANGES=$(echo -e "$UNSTAGED\n$STAGED\n$UNTRACKED" | sort -u | grep -v '^$')

if [ -n "$ALL_CHANGES" ]; then
    echo -e "${CYAN}변경된 파일:${NC}"
    echo "$ALL_CHANGES" | while read -r file; do
        if [ -n "$file" ]; then
            echo "   $file"
        fi
    done

    # 테스트 파일 존재 확인
    echo ""
    HAS_TEST=false
    while IFS= read -r file; do
        if [[ "$file" == *".test."* ]] || [[ "$file" == *"__tests__"* ]]; then
            HAS_TEST=true
            break
        fi
    done <<< "$ALL_CHANGES"

    if [ "$HAS_TEST" = true ]; then
        check_pass "테스트 파일 포함됨"
    else
        check_warn "테스트 파일이 없습니다"
    fi
else
    echo "변경된 파일 없음"
fi

# 6. any 타입 사용 확인
echo -e "\n${BLUE}6️⃣  'any' 타입 사용 확인${NC}"
echo "--------------------------------"
ANY_COUNT=$(grep -r ": any" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | wc -l)
if [ "$ANY_COUNT" -gt 0 ]; then
    check_fail "'any' 타입 ${ANY_COUNT}개 발견"
    grep -r ": any" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | head -5
    echo "   ..."
else
    check_pass "'any' 타입 없음"
fi

# 7. console.log 확인
echo -e "\n${BLUE}7️⃣  console.log 확인${NC}"
echo "--------------------------------"
CONSOLE_COUNT=$(grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | grep -v "\.test\." | wc -l)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    check_warn "console.log ${CONSOLE_COUNT}개 발견 (프로덕션 전 제거 필요)"
else
    check_pass "console.log 없음"
fi

# 8. TODO 주석 확인
echo -e "\n${BLUE}8️⃣  TODO 주석 확인${NC}"
echo "--------------------------------"
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
    check_warn "TODO/FIXME ${TODO_COUNT}개 발견"
    grep -r "TODO\|FIXME\|HACK" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules" | head -3
else
    check_pass "TODO/FIXME 없음"
fi

# 9. Zod 검증 확인 (API routes)
echo -e "\n${BLUE}9️⃣  API 입력 검증 확인${NC}"
echo "--------------------------------"
API_ROUTES=$(find src/app/api -name "route.ts" 2>/dev/null | wc -l)
ZOD_USAGE=$(grep -r "safeParse\|\.parse(" src/app/api --include="*.ts" 2>/dev/null | wc -l)
if [ "$API_ROUTES" -gt 0 ]; then
    if [ "$ZOD_USAGE" -gt 0 ]; then
        check_pass "API 라우트에서 Zod 검증 사용 중"
    else
        check_warn "API 라우트에서 Zod 검증이 없을 수 있음"
    fi
else
    echo "API 라우트 없음 (해당 없음)"
fi

# 결과 요약
echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}📊 검증 결과 요약${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ 통과: $PASS${NC}"
echo -e "${YELLOW}⚠️  경고: $WARN${NC}"
echo -e "${RED}❌ 실패: $FAIL${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
    echo -e "${RED}❌ Vertical Slice 검증 실패${NC}"
    echo "   위의 실패 항목을 수정한 후 다시 실행하세요"
    exit 1
elif [ "$WARN" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Vertical Slice 검증 완료 (경고 있음)${NC}"
    echo "   커밋 전 경고 항목을 검토하세요"
    exit 0
else
    echo -e "${GREEN}✅ Vertical Slice 검증 완료!${NC}"
    echo "   커밋할 준비가 되었습니다"
    echo ""
    echo "💡 다음 단계:"
    echo "   git add ."
    echo "   git commit -m \"feat: [기능 설명]\""
    exit 0
fi
