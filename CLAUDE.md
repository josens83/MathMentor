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

---

## 🧠 Extended Thinking (심층 사고)

복잡한 작업에는 Extended Thinking 트리거를 사용하여 더 깊은 분석을 요청할 수 있습니다.

### 트리거 레벨

| 레벨 | 트리거 | 사용 상황 | 예산 |
|------|--------|-----------|------|
| 기본 | (없음) | 단순 CRUD, UI 수정, 버그 수정 | - |
| 낮음 | "think" | API 설계, 상태 관리, 컴포넌트 구조 | ~10K tokens |
| 중간 | "think hard" | AI 통합, 복잡한 비즈니스 로직 | ~30K tokens |
| 높음 | "think harder" | 아키텍처 설계, 성능 최적화 | ~60K tokens |
| 최고 | "ultrathink" | 시스템 전체 리팩토링, 마이그레이션 | ~120K tokens |

### 사용 예시

```
# 기본 (트리거 없음)
"LoginForm 컴포넌트의 버튼 색상을 파란색으로 변경해줘"

# think
"think - AI 힌트 API의 요청/응답 스키마를 설계해줘"

# think hard
"think hard - 실시간 문제 풀이 협업 기능의 상태 관리 구조를 설계해줘"

# ultrathink
"ultrathink - MathMentor의 전체 인증 시스템을 Supabase Auth에서
 커스텀 JWT 기반으로 마이그레이션하는 계획을 수립해줘"
```

### 트리거 선택 기준

1. **영향 범위**: 변경이 미치는 파일/모듈 수
2. **복잡도**: 고려해야 할 엣지 케이스 수
3. **위험도**: 실수 시 발생할 수 있는 문제의 심각성
4. **가역성**: 변경을 되돌리기 어려운 정도

---

## 🔄 4단계 개발 워크플로우

MathMentor 개발 시 권장하는 체계적인 접근 방식입니다.

### 1️⃣ Explore (탐색)

코드베이스를 먼저 이해합니다.

```bash
# 세션 시작
./scripts/start-session.sh

# 관련 파일 탐색
# - Glob: 파일 패턴 검색
# - Grep: 코드 내용 검색
# - Read: 파일 내용 확인
```

**체크리스트**:
- [ ] 관련 기존 코드 파악
- [ ] 의존성 확인
- [ ] 유사 기능 구현 패턴 확인

### 2️⃣ Plan (계획)

구현 전략을 수립합니다.

**CRISPE 프레임워크 적용**:
- **C**ontext: 현재 상황과 배경
- **R**ole: 역할 정의
- **I**ntent: 달성하려는 목표
- **S**pecifics: 세부 요구사항
- **P**ersonality: 코드 스타일
- **E**xperiment: 검증 방법

**프롬프트 템플릿**: `.claude/prompts/` 디렉토리 참조

### 3️⃣ Code (구현)

Vertical Slice 방식으로 구현합니다.

**Vertical Slice란?**
- 한 기능의 전체 스택을 한 번에 구현
- UI → API → DB까지 완전히 동작하는 최소 단위

**구현 순서**:
1. 타입/스키마 정의
2. API 라우트 구현
3. UI 컴포넌트 구현
4. 통합 테스트

**Iteration**:
```
작은 변경 → 테스트 → 커밋 → 반복
```

### 4️⃣ Commit (커밋)

변경사항을 검증하고 커밋합니다.

```bash
# Vertical Slice 검증
./scripts/verify-slice.sh

# 커밋
git add .
git commit -m "feat: [기능 설명]"
```

**검증 체크리스트**:
- [ ] `npm run typecheck` 통과
- [ ] `npm run test` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공

---

## 📋 프롬프트 템플릿

`.claude/prompts/` 디렉토리에 상황별 템플릿이 준비되어 있습니다.

| 파일 | 용도 |
|------|------|
| `feature-request.md` | 새 기능 요청 |
| `bug-fix.md` | 버그 수정 |
| `code-review.md` | 코드 리뷰 |
| `refactoring.md` | 리팩토링 |

### 사용법

1. 해당 템플릿 파일 참조
2. CRISPE 섹션 채우기
3. 복잡도에 따라 Extended Thinking 트리거 추가

---

## 🛠 개발 스크립트

`scripts/` 디렉토리의 자동화 스크립트:

| 스크립트 | 용도 |
|----------|------|
| `start-session.sh` | 개발 세션 시작, 환경 검증 |
| `verify-slice.sh` | Vertical Slice 검증 |

### 실행 방법

```bash
# 실행 권한 부여 (최초 1회)
chmod +x scripts/*.sh

# 세션 시작
./scripts/start-session.sh

# Slice 검증
./scripts/verify-slice.sh
```

---

## 🎯 MathMentor 특화 가이드

### AI 튜터링 기능 개발 시

1. **프롬프트 안전성**: 사용자 입력이 AI 프롬프트에 주입되지 않도록 검증
2. **응답 스트리밍**: 긴 응답은 스트리밍으로 처리
3. **폴백 처리**: AI 서비스 장애 시 graceful degradation

### 게이미피케이션 기능 개발 시

1. **XP 계산**: `src/lib/constants.ts`의 `XP_CONFIG` 참조
2. **레벨 공식**: `xpForLevel(n) = (n-1)² × 100`
3. **에너지 시스템**: 최대 5, 30분마다 1 회복

### 수학 렌더링 기능 개발 시

1. **KaTeX 에러 핸들링**: 잘못된 LaTeX도 graceful하게 처리
2. **디스플레이 모드**: 블록 수식은 `displayMode: true`
3. **모바일 최적화**: 긴 수식은 스크롤 가능하게

---

## ⚡ 성능 최적화 가이드

### Core Web Vitals 목표

| 메트릭 | 목표 | 측정 대상 |
|--------|------|----------|
| **LCP** | < 2.5초 | 가장 큰 콘텐츠 렌더링 |
| **INP** | < 200ms | 상호작용 반응성 |
| **CLS** | < 0.1 | 레이아웃 안정성 |

### 성능 측정 명령어

```bash
npm run analyze          # 번들 크기 분석
npm run build            # 프로덕션 빌드 + 성능 체크
```

### LCP 최적화

```tsx
// ✅ 히어로 이미지에 priority 사용
import { OptimizedImage } from "@/components/ui/OptimizedImage";

<OptimizedImage
  src="/hero.webp"
  alt="Hero"
  priority              // LCP 이미지는 필수
  aspectRatio="21/9"
/>
```

### INP 최적화

```typescript
// ✅ Long Task 방지 - 청크 처리
import { processInChunks } from "@/lib/performance";

const results = await processInChunks(
  largeArray,
  item => heavyComputation(item),
  { chunkSize: 50, onProgress: setProgress }
);
```

### CLS 최적화

```tsx
// ✅ Skeleton으로 공간 확보
import { CardSkeleton } from "@/components/ui/Skeleton";

{isLoading ? (
  <CardSkeleton />
) : (
  <ProductCard product={product} />
)}
```

### 성능 모니터링

```tsx
// app/layout.tsx에 추가
import { WebVitals } from "@/components/analytics/WebVitals";

<WebVitals
  debug={process.env.NODE_ENV === "development"}
  onReport={(metric) => sendToAnalytics(metric)}
/>
```

### 성능 체크리스트

- [ ] LCP 이미지에 `priority` 적용
- [ ] 모든 이미지에 `aspectRatio` 또는 크기 명시
- [ ] 긴 목록은 가상화 적용
- [ ] 무거운 계산은 `processInChunks` 사용
- [ ] 데이터 로딩 시 Skeleton UI 표시
- [ ] Server Components 우선 사용
- [ ] `npm run analyze`로 번들 크기 확인
