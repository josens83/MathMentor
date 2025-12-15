# MathMentor - AI 수학 튜터 플랫폼

MathMentor는 AI 기반 개인화 학습과 게이미피케이션을 결합한 수학 학습 웹 애플리케이션입니다.

## 주요 기능

- **AI 맞춤 튜터**: Claude AI가 풀이 과정을 분석하고 실시간 힌트/피드백 제공
- **게이미피케이션**: XP, 레벨, 스트릭, 업적으로 학습 동기 부여
- **단계별 풀이**: 수학 개념을 완벽하게 이해할 수 있는 단계별 문제 풀이
- **수학 수식 입력**: KaTeX 기반 수식 렌더링 및 입력 키보드

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui 스타일 컴포넌트
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude API
- **Payments**: Stripe
- **Math**: KaTeX

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 값을 설정하세요:

```bash
cp .env.example .env.local
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. `supabase/schema.sql`을 SQL Editor에서 실행
3. 환경 변수에 Supabase URL과 키 설정

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 페이지 (로그인, 회원가입)
│   ├── (dashboard)/       # 대시보드 페이지
│   └── api/               # API 라우트
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── auth/             # 인증 컴포넌트
│   └── math/             # 수학 관련 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── supabase/         # Supabase 클라이언트
│   └── claude/           # Claude AI 설정
├── hooks/                 # React 훅
├── stores/               # Zustand 상태 관리
└── types/                # TypeScript 타입
```

## 라이선스

MIT
