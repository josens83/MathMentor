# Vertical Slice 구현

전체 스택을 관통하는 최소 기능 단위를 구현합니다.

## 기능
$ARGUMENTS

## Vertical Slice 구조

```
┌─────────────────────────────────────┐
│           UI Component              │  ← 사용자 인터페이스
├─────────────────────────────────────┤
│           API Route                 │  ← 서버 로직
├─────────────────────────────────────┤
│         Database Query              │  ← 데이터 저장
└─────────────────────────────────────┘
```

## 구현 순서

### Step 1: 타입 정의
```typescript
// src/types/[feature].ts
interface FeatureInput { ... }
interface FeatureOutput { ... }
```

### Step 2: Zod 스키마
```typescript
// src/lib/validations/[feature].ts
export const featureSchema = z.object({ ... });
```

### Step 3: API 라우트
```typescript
// src/app/api/[feature]/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const validated = featureSchema.parse(body);
  // ... 로직
}
```

### Step 4: UI 컴포넌트
```typescript
// src/components/[feature]/FeatureComponent.tsx
"use client";
export function FeatureComponent() {
  // ... UI 로직
}
```

### Step 5: 통합 테스트
```typescript
// src/components/[feature]/FeatureComponent.test.tsx
describe("FeatureComponent", () => {
  it("should work end-to-end", () => {
    // ...
  });
});
```

## 완료 체크리스트
- [ ] 타입 정의 완료
- [ ] Zod 스키마 작성
- [ ] API 라우트 구현
- [ ] UI 컴포넌트 구현
- [ ] 테스트 작성
- [ ] typecheck/test/lint 통과

위 순서대로 Vertical Slice를 구현해주세요.
