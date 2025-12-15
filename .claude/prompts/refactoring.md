# Refactoring Prompt Template

## CRISPE Framework for Refactoring

Use this template when planning and executing refactoring tasks in MathMentor.

---

## Template

```
## Context (배경)
- 리팩토링 대상: [파일/모듈/시스템]
- 현재 문제점: [코드 스멜, 기술 부채]
- 영향 범위: [영향받는 파일/기능]

## Role (역할)
당신은 클린 코드와 SOLID 원칙에 정통한 시니어 개발자입니다.
점진적 리팩토링과 안전한 코드 변경에 능숙합니다.

## Intent (의도)
[리팩토링 목표]를 달성하여 [기대 효과]를 얻습니다.

## Specifics (세부사항)
### 리팩토링 유형
- [ ] 추출 (Extract): 함수, 클래스, 모듈 분리
- [ ] 이동 (Move): 책임 재배치
- [ ] 이름 변경 (Rename): 명확한 네이밍
- [ ] 단순화 (Simplify): 복잡도 감소
- [ ] 인라인 (Inline): 불필요한 추상화 제거

### 제약조건
- 기능 변경 없음 (동작 보존)
- 테스트 통과 유지
- 단계별 커밋

### 성공 기준
- [측정 가능한 기준 1]
- [측정 가능한 기준 2]

## Personality (성격)
- 점진적이고 안전한 변경
- 각 단계마다 테스트 검증
- 명확한 커밋 메시지

## Experiment (실험)
각 단계 후:
- [ ] npm run test 통과
- [ ] npm run typecheck 통과
- [ ] 기능 동작 확인
```

---

## Example: AI Client 모듈화

```
## Context (배경)
- 리팩토링 대상: src/lib/claude/client.ts
- 현재 문제점: 단일 파일에 모든 AI 로직이 집중 (300+ lines)
- 영향 범위: src/app/api/ai/*, src/components/math/*

## Role (역할)
당신은 클린 코드와 SOLID 원칙에 정통한 시니어 개발자입니다.

## Intent (의도)
AI 클라이언트를 모듈화하여 유지보수성과 테스트 용이성을 높입니다.

## Specifics (세부사항)
### 리팩토링 유형
- [x] 추출 (Extract): 기능별 모듈 분리

### 제안 구조
```
src/lib/claude/
├── index.ts           # 공개 API
├── client.ts          # 기본 클라이언트 설정
├── prompts/
│   ├── index.ts
│   ├── hint.ts        # 힌트 프롬프트
│   ├── solution.ts    # 풀이 프롬프트
│   └── feedback.ts    # 피드백 프롬프트
├── services/
│   ├── hint-service.ts
│   ├── solution-service.ts
│   └── feedback-service.ts
└── types.ts           # AI 관련 타입
```

### 성공 기준
- 각 파일 100줄 이하
- 단일 책임 원칙 준수
- 테스트 커버리지 유지

## Personality (성격)
- 점진적 변경
- 각 단계 테스트 검증

## Experiment (실험)
1. 타입 분리 → 테스트
2. 프롬프트 분리 → 테스트
3. 서비스 분리 → 테스트
4. 인덱스 정리 → 최종 테스트
```

---

## Refactoring Workflow

### Phase 1: 준비 (Preparation)
```bash
# 현재 상태 확인
npm run test
npm run typecheck

# 브랜치 생성
git checkout -b refactor/[대상]
```

### Phase 2: 분석 (Analysis)
- 의존성 그래프 파악
- 테스트 커버리지 확인
- 영향 범위 식별

### Phase 3: 실행 (Execution)
각 단계마다:
1. 작은 변경 수행
2. 테스트 실행
3. 커밋

```bash
# 단계별 커밋 예시
git commit -m "refactor: extract types to separate file"
git commit -m "refactor: move prompts to prompts directory"
git commit -m "refactor: create HintService class"
```

### Phase 4: 검증 (Verification)
```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

---

## Common Refactoring Patterns

### 1. Extract Function
```typescript
// Before
function processAnswer(answer: string, problemId: string) {
  // 검증 로직 (10줄)
  // 채점 로직 (15줄)
  // 피드백 로직 (10줄)
}

// After
function processAnswer(answer: string, problemId: string) {
  const validated = validateAnswer(answer);
  const score = gradeAnswer(validated, problemId);
  return generateFeedback(score);
}
```

### 2. Replace Conditional with Polymorphism
```typescript
// Before
function getXP(problemType: string): number {
  if (problemType === 'easy') return 10;
  if (problemType === 'medium') return 25;
  if (problemType === 'hard') return 50;
  return 0;
}

// After
const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

function getXP(difficulty: Difficulty): number {
  return XP_BY_DIFFICULTY[difficulty];
}
```

### 3. Introduce Parameter Object
```typescript
// Before
function createProblem(
  title: string,
  content: string,
  difficulty: Difficulty,
  topic: Topic,
  xp: number
) { ... }

// After
interface CreateProblemInput {
  title: string;
  content: string;
  difficulty: Difficulty;
  topic: Topic;
  xp: number;
}

function createProblem(input: CreateProblemInput) { ... }
```

---

## MathMentor Specific Refactoring Targets

| 대상 | 현재 문제 | 제안 |
|------|-----------|------|
| `claude/client.ts` | 300+ lines, 다중 책임 | 서비스별 분리 |
| `components/math/` | 중복 KaTeX 로직 | 커스텀 훅 추출 |
| `stores/` | 전역 상태 과다 | 도메인별 분리 |
| `api/` | 에러 핸들링 중복 | 미들웨어 패턴 |
| `validations/` | 스키마 중복 | 합성 가능한 기본 스키마 |

---

## Safety Checklist

리팩토링 전 확인:
- [ ] 충분한 테스트 커버리지
- [ ] 기능 동작 기준선 설정
- [ ] 롤백 계획 수립

리팩토링 중 확인:
- [ ] 각 단계 후 테스트 통과
- [ ] 타입 에러 없음
- [ ] 작은 단위로 커밋

리팩토링 후 확인:
- [ ] 모든 기존 테스트 통과
- [ ] 새 테스트 추가 (필요시)
- [ ] 성능 저하 없음
- [ ] 문서 업데이트
