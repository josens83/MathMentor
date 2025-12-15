# Feature Request Prompt Template

## CRISPE Framework Application

Use this template when requesting new features for MathMentor.

---

## Template

```
## Context (배경)
- 현재 MathMentor 상태: [현재 관련 기능 설명]
- 기술 스택: Next.js 15, TypeScript, Supabase, Claude AI
- 관련 파일: [관련 파일 경로 나열]

## Role (역할)
당신은 교육 기술(EdTech) 전문가이자 풀스택 개발자입니다.
게이미피케이션과 AI 튜터링에 깊은 이해가 있습니다.

## Intent (의도)
[기능명]을 구현하여 [달성하려는 목표]를 이루고자 합니다.

## Specifics (세부사항)
### 요구사항
1. [요구사항 1]
2. [요구사항 2]
3. [요구사항 3]

### 제약조건
- TypeScript strict 모드 준수
- Zod 스키마로 모든 입력 검증
- 테스트 코드 포함 필수
- RLS 정책 고려

### 기대 결과
- [예상 동작 1]
- [예상 동작 2]

## Personality (성격)
- 간결하고 명확한 코드
- 한국어 주석 및 문서화
- 교육적 UX 우선

## Experiment (실험)
구현 후 다음을 확인해주세요:
- [ ] npm run typecheck 통과
- [ ] npm run test 통과
- [ ] npm run lint 통과
```

---

## Example: AI 힌트 레벨 시스템

```
## Context (배경)
- 현재 MathMentor 상태: 기본 AI 힌트 API가 구현됨
- 기술 스택: Next.js 15, TypeScript, Supabase, Claude AI
- 관련 파일: src/app/api/ai/hint/route.ts, src/lib/claude/

## Role (역할)
당신은 교육 기술(EdTech) 전문가이자 풀스택 개발자입니다.

## Intent (의도)
3단계 힌트 레벨 시스템을 구현하여 학생들이 점진적으로
문제 해결 능력을 기를 수 있도록 합니다.

## Specifics (세부사항)
### 요구사항
1. Level 1: 방향만 제시 (예: "이차방정식을 생각해보세요")
2. Level 2: 구체적 힌트 (예: "인수분해를 시도해보세요")
3. Level 3: 단계별 풀이 시작 (예: "x² + 5x + 6 = (x+2)(x+3)")

### 제약조건
- 힌트 요청마다 에너지 소모 (5 energy)
- 사용한 힌트 레벨 기록
- Level 3 사용 시 XP 50% 감소

### 기대 결과
- 학생이 최소한의 도움으로 문제 해결
- 힌트 사용 통계 추적 가능

## Personality (성격)
- 교육적이고 격려하는 톤
- 학생 수준에 맞는 설명

## Experiment (실험)
- [ ] 각 레벨별 힌트 생성 테스트
- [ ] 에너지 차감 로직 테스트
- [ ] XP 계산 로직 테스트
```

---

## Extended Thinking Triggers

복잡도에 따라 적절한 트리거 사용:

| 복잡도 | 트리거 | 사용 상황 |
|--------|--------|-----------|
| 낮음 | (기본) | 단순 CRUD, UI 수정 |
| 중간 | "think" | API 설계, 상태 관리 |
| 높음 | "think hard" | AI 통합, 복잡한 로직 |
| 매우 높음 | "ultrathink" | 아키텍처 설계, 성능 최적화 |
