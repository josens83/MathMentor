# Project: MathMentor

## 📋 Overview
AI 기반 개인화 수학 학습 플랫폼 - Duolingo 스타일 게이미피케이션과 Claude AI 튜터링 결합

- **목적**: 수학 학습의 진입장벽을 낮추고 학습 동기를 극대화
- **타겟 사용자**: 초등~성인까지 수학 학습이 필요한 모든 사람
- **핵심 가치**: AI 맞춤 튜터링 + 게이미피케이션 + 단계별 풀이

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI**: Custom components (shadcn/ui 스타일)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Anthropic Claude API
- **Payments**: Stripe
- **Math Rendering**: KaTeX
- **State**: Zustand
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library

---

## 🔧 Commands
```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint 검사
npm run typecheck    # TypeScript 타입 검사
npm run test         # Vitest 테스트 실행
npm run test:ui      # Vitest UI 모드
npm run test:cov     # 테스트 커버리지
```

---

## 📁 Project Structure
```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 인증 라우트 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # 대시보드 라우트 그룹
│   │   ├── dashboard/
│   │   ├── learn/
│   │   ├── practice/
│   │   └── profile/
│   ├── (marketing)/         # 마케팅 페이지
│   │   ├── pricing/
│   │   └── about/
│   └── api/                 # API 라우트
│       ├── auth/
│       ├── ai/
│       └── stripe/
├── components/
│   ├── ui/                  # 재사용 UI 컴포넌트
│   ├── auth/                # 인증 관련 컴포넌트
│   ├── math/                # 수학 렌더링/입력 컴포넌트
│   ├── dashboard/           # 대시보드 컴포넌트
│   └── gamification/        # 게이미피케이션 컴포넌트
├── lib/
│   ├── supabase/            # Supabase 클라이언트
│   ├── claude/              # Claude AI 클라이언트
│   ├── stripe/              # Stripe 클라이언트
│   ├── validations/         # Zod 스키마
│   ├── utils.ts             # 공통 유틸리티
│   └── constants.ts         # 상수 정의
├── hooks/                   # 커스텀 React 훅
├── stores/                  # Zustand 스토어
├── types/                   # TypeScript 타입 정의
└── styles/                  # 글로벌 스타일
```

---

## 🎨 Code Style

### TypeScript
- **strict 모드 필수** - tsconfig.json에서 strict: true
- **`any` 타입 절대 금지** → `unknown` 사용 후 타입 가드
- 모든 함수에 반환 타입 명시
- 인터페이스: `I` 접두사 없이 (예: `User`, not `IUser`)
- 타입 vs 인터페이스: 객체는 interface, 유니온/유틸리티는 type

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  profile: Profile | null;
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Bad
function getUser(id: any): any {
  // ...
}
```

### React/Next.js
- 함수형 컴포넌트 + Hooks만 사용
- Server Components 기본, 'use client'는 필요할 때만
- Props는 interface로 정의
- 컴포넌트 파일명: PascalCase (예: `MathRenderer.tsx`)
- 한 파일에 하나의 export default 컴포넌트

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'default', size = 'md', children, onClick }: ButtonProps) {
  // ...
}
```

### Styling (Tailwind CSS)
- 유틸리티 클래스 사용, 커스텀 CSS 최소화
- 색상: CSS 변수 사용 (`text-primary`, `bg-muted`)
- 반응형: mobile-first (`md:`, `lg:` 순서)
- cn() 유틸리티로 조건부 클래스 결합

```typescript
// ✅ Good
<div className={cn(
  "rounded-lg p-4",
  isActive && "bg-primary text-primary-foreground",
  className
)}>
```

### Naming Conventions
| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `getUserById`, `isLoading` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ENERGY`, `XP_CONFIG` |
| 컴포넌트 | PascalCase | `MathKeyboard`, `LoginForm` |
| 파일 (컴포넌트) | PascalCase | `MathRenderer.tsx` |
| 파일 (유틸리티) | kebab-case | `use-user.ts` |
| 불리언 | is/has/should/can 접두사 | `isLoading`, `hasError`, `canSubmit` |

---

## 🗄️ Database (Supabase)

### 필수 규칙
- **RLS (Row Level Security) 항상 활성화**
- 모든 테이블에 `created_at`, `updated_at` 필드
- 외래 키: `ON DELETE CASCADE` 사용
- 인덱스: 자주 조회되는 컬럼에 필수

### 쿼리 패턴
```typescript
// ✅ Good: Supabase 클라이언트 사용
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (error) throw new DatabaseError(error.message);

// ❌ Bad: Raw SQL, 문자열 연결
const query = `SELECT * FROM profiles WHERE id = '${userId}'`;
```

### 타입 안전성
```typescript
// types/database.ts에서 생성된 타입 사용
import type { Database } from '@/types/database';
type Profile = Database['public']['Tables']['profiles']['Row'];
```

---

## 🔒 Security Rules

### 입력 유효성 검사 (Zod 필수)
```typescript
import { z } from 'zod';

// 모든 사용자 입력에 스키마 적용
const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
});

// API 라우트에서 사용
const result = loginSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
}
```

### 금지 사항
- ❌ `eval()` 사용 금지
- ❌ `dangerouslySetInnerHTML` 최소화 (KaTeX 제외)
- ❌ 클라이언트에서 민감한 로직 처리 금지
- ❌ API 키 하드코딩 금지
- ❌ console.log에 민감 정보 출력 금지
- ❌ `any` 타입으로 타입 검사 우회 금지

### 환경 변수
```bash
# 클라이언트 노출 가능 (NEXT_PUBLIC_ 접두사)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# 서버 전용 (절대 클라이언트 노출 금지)
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 🧪 Testing

### 전략
- **단위 테스트**: Vitest + React Testing Library
- **통합 테스트**: API 라우트 테스트
- **커버리지 목표**: 80% 이상

### 파일 위치
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx    # 같은 위치
└── lib/
    ├── utils.ts
    └── __tests__/
        └── utils.test.ts      # __tests__ 폴더
```

### 명명 규칙
```typescript
describe('MathRenderer', () => {
  it('should render inline LaTeX correctly', () => {});
  it('should render display mode LaTeX correctly', () => {});
  it('should handle invalid LaTeX gracefully', () => {});
});
```

---

## ⚠️ Critical Rules (절대 위반 금지)

1. **`any` 타입 사용 금지** → `unknown` + 타입 가드 사용
2. **사용자 입력 직접 사용 금지** → Zod 스키마 검증 필수
3. **API 키 하드코딩 금지** → 환경 변수만 사용
4. **RLS 비활성화 금지** → 모든 테이블에 RLS 정책 필수
5. **테스트 없는 핵심 기능 금지** → 비즈니스 로직은 테스트 필수
6. **console.log 프로덕션 금지** → logger 유틸리티 또는 삭제

---

## 📝 Git Conventions

### 브랜치
- `feature/[기능명]`: `feature/ai-tutor-chat`
- `fix/[버그명]`: `fix/login-validation`
- `refactor/[대상]`: `refactor/auth-flow`

### 커밋 메시지 (Conventional Commits)
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 스타일 (포맷팅)
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 변경
```

### 예시
```
feat: AI 힌트 API 추가
fix: 로그인 이메일 유효성 검사 오류 수정
refactor: Supabase 클라이언트 모듈화
test: MathRenderer 컴포넌트 테스트 추가
```

---

## 🚀 Deployment Checklist

### 빌드 전 확인
```bash
npm run typecheck  # TypeScript 에러 없음
npm run lint       # ESLint 경고/에러 없음
npm run test       # 모든 테스트 통과
npm run build      # 빌드 성공
```

### 환경 변수 체크
```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ ANTHROPIC_API_KEY
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### 성능 목표
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## 🔗 Key Files Reference

| 파일 | 용도 |
|------|------|
| `src/lib/supabase/client.ts` | 브라우저 Supabase 클라이언트 |
| `src/lib/supabase/server.ts` | 서버 Supabase 클라이언트 |
| `src/lib/claude/client.ts` | Claude AI 클라이언트 |
| `src/lib/constants.ts` | XP, 에너지, 가격 등 상수 |
| `src/types/database.ts` | Supabase 타입 정의 |
| `src/middleware.ts` | 인증 미들웨어 |
| `supabase/schema.sql` | 데이터베이스 스키마 |
