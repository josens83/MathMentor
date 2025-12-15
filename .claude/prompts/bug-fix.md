# Bug Fix Prompt Template

## CRISPE Framework for Debugging

Use this template when reporting and fixing bugs in MathMentor.

---

## Template

```
## Context (배경)
- 환경: [개발/프로덕션]
- 브라우저/OS: [환경 정보]
- 관련 파일: [관련 파일 경로]
- 최근 변경: [관련 있을 수 있는 최근 커밋]

## Role (역할)
당신은 디버깅 전문가이자 MathMentor 코드베이스에 익숙한 개발자입니다.
근본 원인 분석(Root Cause Analysis)에 능숙합니다.

## Intent (의도)
[버그 현상]을 수정하여 [정상 동작]이 되도록 합니다.

## Specifics (세부사항)
### 버그 현상
- 예상 동작: [예상했던 동작]
- 실제 동작: [실제로 발생한 동작]
- 재현 단계:
  1. [단계 1]
  2. [단계 2]
  3. [단계 3]

### 에러 메시지 (있는 경우)
```
[에러 메시지 복사]
```

### 시도한 해결책
- [시도 1]: [결과]
- [시도 2]: [결과]

## Personality (성격)
- 체계적이고 논리적인 접근
- 근본 원인 해결 우선
- 회귀 테스트 고려

## Experiment (실험)
수정 후 확인:
- [ ] 버그 재현 불가 확인
- [ ] 관련 테스트 추가
- [ ] 기존 테스트 통과
- [ ] 사이드 이펙트 없음
```

---

## Example: 로그인 유효성 검사 오류

```
## Context (배경)
- 환경: 개발
- 브라우저/OS: Chrome 120 / macOS
- 관련 파일: src/components/auth/LoginForm.tsx, src/lib/validations/auth.ts
- 최근 변경: Zod v4 업그레이드 (commit abc123)

## Role (역할)
당신은 디버깅 전문가이자 MathMentor 코드베이스에 익숙한 개발자입니다.

## Intent (의도)
대문자 이메일 입력 시 발생하는 유효성 검사 오류를 수정합니다.

## Specifics (세부사항)
### 버그 현상
- 예상 동작: "TEST@EXAMPLE.COM" 입력 시 소문자 변환 후 로그인
- 실제 동작: "유효하지 않은 이메일" 에러 표시
- 재현 단계:
  1. 로그인 페이지 접속
  2. 이메일에 "TEST@EXAMPLE.COM" 입력
  3. 비밀번호 입력 후 로그인 클릭
  4. 에러 메시지 표시

### 에러 메시지
```
Invalid email address
```

### 시도한 해결책
- toLowerCase() 추가: 효과 없음 (Zod transform 순서 문제)

## Personality (성격)
- 체계적 디버깅
- 회귀 방지

## Experiment (실험)
- [ ] 대소문자 혼합 이메일로 로그인 테스트
- [ ] loginSchema 단위 테스트 추가
- [ ] 기존 인증 테스트 통과
```

---

## Debugging Workflow

### 1. 재현 (Reproduce)
```bash
# 관련 테스트 실행
npm run test -- --grep "login"

# 개발 서버에서 수동 테스트
npm run dev
```

### 2. 격리 (Isolate)
```bash
# 관련 파일 검색
# Grep tool 사용하여 관련 코드 찾기
```

### 3. 분석 (Analyze)
- 콜 스택 추적
- 데이터 플로우 확인
- 타입 검사

### 4. 수정 (Fix)
- 최소한의 변경
- 타입 안전성 유지
- 테스트 추가

### 5. 검증 (Verify)
```bash
npm run typecheck
npm run test
npm run lint
```

---

## Common Bug Patterns in MathMentor

| 패턴 | 증상 | 해결책 |
|------|------|--------|
| Zod 버전 호환성 | flatten() 오류 | Zod v4 API 확인 |
| Supabase RLS | 데이터 누락 | RLS 정책 검토 |
| Server/Client 혼합 | 'use client' 오류 | 컴포넌트 분리 |
| 타입 불일치 | TypeScript 에러 | Database 타입 재생성 |
| 비동기 처리 | 레이스 컨디션 | await/async 검토 |
