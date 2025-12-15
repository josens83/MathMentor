# Code Review Prompt Template

## CRISPE Framework for Code Review

Use this template when requesting code reviews for MathMentor.

---

## Template

```
## Context (배경)
- PR/커밋: [PR 번호 또는 커밋 해시]
- 변경 범위: [변경된 파일 수, 라인 수]
- 관련 이슈: [이슈 번호]
- 변경 유형: [feature/fix/refactor/test]

## Role (역할)
당신은 시니어 풀스택 개발자이자 코드 품질 전문가입니다.
MathMentor의 코드 스타일과 아키텍처에 익숙합니다.

## Intent (의도)
코드 품질, 보안, 성능, 유지보수성 관점에서 리뷰합니다.

## Specifics (세부사항)
### 리뷰 중점 영역
- [ ] TypeScript 타입 안전성
- [ ] 보안 취약점 (XSS, SQL Injection 등)
- [ ] 성능 이슈
- [ ] 테스트 커버리지
- [ ] 코드 스타일 일관성
- [ ] 에러 핸들링

### 변경 요약
[변경 내용 간략 설명]

### 특별 확인 요청
[특별히 검토가 필요한 부분]

## Personality (성격)
- 건설적이고 교육적인 피드백
- 구체적인 개선 제안
- 긍정적인 부분도 언급

## Experiment (실험)
리뷰 후 확인:
- [ ] 모든 피드백 반영
- [ ] 테스트 추가/수정
- [ ] 문서 업데이트
```

---

## Review Checklist

### 1. TypeScript & Type Safety
```typescript
// ❌ Bad
function processData(data: any) { ... }

// ✅ Good
function processData(data: unknown): ProcessedData {
  const validated = dataSchema.parse(data);
  ...
}
```

### 2. Security (Zod Validation)
```typescript
// ❌ Bad - 직접 사용
const { email } = req.body;
await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Good - Zod 검증
const { email } = emailSchema.parse(req.body);
const { data } = await supabase.from('users').select().eq('email', email);
```

### 3. React Patterns
```typescript
// ❌ Bad - 불필요한 useEffect
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Good - 파생 상태
const fullName = `${firstName} ${lastName}`;
```

### 4. Error Handling
```typescript
// ❌ Bad
try {
  await fetchData();
} catch (e) {
  console.log(e);
}

// ✅ Good
try {
  await fetchData();
} catch (error) {
  if (error instanceof ApiError) {
    return { error: error.message };
  }
  throw error;
}
```

### 5. Performance
```typescript
// ❌ Bad - 렌더링마다 새 객체
<Component style={{ margin: 10 }} />

// ✅ Good - 메모이제이션 또는 상수
const styles = { margin: 10 };
<Component style={styles} />
```

---

## Review Response Format

### Severity Levels

| Level | Emoji | 의미 |
|-------|-------|------|
| Critical | 🚨 | 반드시 수정 필요 (보안, 버그) |
| Major | ⚠️ | 수정 권장 (성능, 유지보수) |
| Minor | 💡 | 개선 제안 (스타일, 가독성) |
| Positive | ✅ | 좋은 코드, 칭찬 |
| Question | ❓ | 의도 확인 필요 |

### Response Template

```markdown
## 코드 리뷰: [PR/커밋 제목]

### 요약
[전체적인 코드 품질 평가]

### 주요 피드백

#### 🚨 Critical
- **파일:라인** - [문제 설명]
  ```typescript
  // 수정 제안
  ```

#### ⚠️ Major
- **파일:라인** - [문제 설명]

#### 💡 Minor
- **파일:라인** - [개선 제안]

#### ✅ Positive
- [좋았던 점]

### 체크리스트
- [ ] TypeScript 타입 안전성 ✅
- [ ] 보안 검토 ✅
- [ ] 테스트 커버리지 ⚠️ (80% 미만)
- [ ] 문서화 ✅

### 승인 상태
- [ ] 승인 (Approve)
- [x] 수정 요청 (Request Changes)
- [ ] 코멘트만 (Comment)
```

---

## MathMentor Specific Checks

### AI Integration
- Claude API 호출에 타임아웃 설정
- 프롬프트 인젝션 방지
- 응답 스트리밍 처리

### Gamification
- XP 계산 로직 정확성
- 에너지 시스템 경계 조건
- 레벨업 트리거 검증

### Math Rendering
- KaTeX 에러 핸들링
- 디스플레이/인라인 모드 구분
- 모바일 반응형

### Database
- RLS 정책 적용 여부
- 인덱스 사용 확인
- N+1 쿼리 방지
