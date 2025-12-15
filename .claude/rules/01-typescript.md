# TypeScript Rules

## Strict Mode
tsconfig.json에서 다음 옵션 필수:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Type Safety

### any 금지
```typescript
// ❌ Bad
function process(data: any): any {
  return data.value;
}

// ✅ Good
function process<T extends { value: unknown }>(data: T): T['value'] {
  return data.value;
}

// ✅ Good: unknown + 타입 가드
function processUnknown(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    const value = (data as { value: unknown }).value;
    if (typeof value === 'string') {
      return value;
    }
  }
  throw new Error('Invalid data');
}
```

### 타입 가드 패턴
```typescript
// 타입 가드 함수
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  );
}

// 사용
if (isUser(data)) {
  console.log(data.email); // 타입 안전
}
```

### 반환 타입 명시
```typescript
// ❌ Bad: 추론에 의존
async function getUser(id: string) {
  const { data } = await supabase.from('profiles').select().eq('id', id).single();
  return data;
}

// ✅ Good: 명시적 반환 타입
async function getUser(id: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select().eq('id', id).single();
  return data;
}
```

## Null/Undefined 처리

### Optional Chaining
```typescript
// ✅ Good
const userName = user?.profile?.displayName ?? 'Anonymous';
```

### Nullish Coalescing
```typescript
// ✅ Good: nullish coalescing
const count = data.count ?? 0;

// ❌ Bad: OR 연산자 (0, ''도 false)
const count = data.count || 0;
```

## 제네릭 사용
```typescript
// API 응답 래퍼
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}
```
