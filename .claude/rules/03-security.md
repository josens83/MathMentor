# Security Rules

## 입력 유효성 검사

### Zod 스키마 필수
모든 사용자 입력은 반드시 Zod로 검증:

```typescript
import { z } from 'zod';

// 공통 스키마
export const emailSchema = z.string().email().max(255).toLowerCase();
export const passwordSchema = z.string().min(8).max(100);
export const uuidSchema = z.string().uuid();

// API 요청 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const problemAnswerSchema = z.object({
  problemId: uuidSchema,
  answer: z.string().max(10000),
  timeSpent: z.number().int().positive().max(3600),
});
```

### API 라우트에서 검증
```typescript
import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 스키마 검증
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // 검증된 데이터 사용
    const { email, password } = result.data;
    // ...
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
```

## SQL Injection 방지

### Supabase 클라이언트만 사용
```typescript
// ✅ Good: Supabase 클라이언트
const { data } = await supabase
  .from('profiles')
  .select('id, email, display_name')
  .eq('id', userId);

// ❌ Bad: Raw SQL
const query = `SELECT * FROM profiles WHERE id = '${userId}'`;

// ❌ Bad: 문자열 템플릿
const { data } = await supabase.rpc('get_user', { user_id: `${userId}` });
```

## XSS 방지

### 사용자 콘텐츠 렌더링
```typescript
// ❌ Bad: 직접 HTML 삽입
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Good: 텍스트로 렌더링
<div>{userContent}</div>

// ✅ Good: 필요시 DOMPurify 사용
import DOMPurify from 'dompurify';
const cleanHtml = DOMPurify.sanitize(userContent);
<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
```

### KaTeX 예외 처리
```typescript
// KaTeX는 자체 새니타이제이션 수행
// 하지만 throwOnError: false로 안전하게 처리
const html = katex.renderToString(latex, {
  displayMode: true,
  throwOnError: false,  // 에러 시 빨간 텍스트로 표시
  strict: false,
});
```

## 인증 & 권한

### 서버에서 항상 검증
```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  // 인증 확인
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 권한 확인 (예: Pro 구독자만)
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_tier !== 'pro') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 비즈니스 로직
}
```

### RLS 정책 활용
```sql
-- 사용자는 자신의 데이터만 접근
CREATE POLICY "Users can view own data"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 서비스 역할만 모든 데이터 접근
CREATE POLICY "Service role can do anything"
ON profiles FOR ALL
USING (auth.role() = 'service_role');
```

## 환경 변수 보안

### 클라이언트 노출 구분
```typescript
// ✅ 클라이언트 안전 (NEXT_PUBLIC_ 접두사)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ❌ 서버 전용 (클라이언트에서 접근 불가)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
```

### 런타임 검증
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
});

export const env = envSchema.parse(process.env);
```

## Rate Limiting

### API 라우트 보호
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 60초에 10회
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  }

  // 비즈니스 로직
}
```

## 금지 목록

- ❌ `eval()`, `Function()` 생성자
- ❌ `document.write()`
- ❌ 인라인 이벤트 핸들러 (`onclick=""`)
- ❌ `javascript:` URL
- ❌ 사용자 입력을 URL/경로에 직접 사용
- ❌ 에러 메시지에 스택 트레이스 노출
- ❌ 프로덕션에서 디버그 정보 노출
