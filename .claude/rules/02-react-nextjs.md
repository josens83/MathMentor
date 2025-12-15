# React & Next.js Rules

## 컴포넌트 패턴

### Server vs Client Components
```typescript
// 기본: Server Component (async 가능)
export default async function DashboardPage() {
  const data = await fetchData(); // 서버에서 직접 fetch
  return <Dashboard data={data} />;
}

// 필요할 때만: Client Component
'use client';
export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Props Interface 정의
```typescript
// ✅ Good
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ title, description, children, className, onClick }: CardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)} onClick={onClick}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
```

### Children 타입
```typescript
// ReactNode: 가장 일반적
children: React.ReactNode;

// 특정 요소만 허용
children: React.ReactElement<ButtonProps>;

// 함수형 children (render props)
children: (data: T) => React.ReactNode;
```

## Hooks 규칙

### 커스텀 훅 명명
```typescript
// use 접두사 필수
function useUser() { }
function useLocalStorage<T>(key: string) { }
function useMathProblem(problemId: string) { }
```

### 의존성 배열
```typescript
// ✅ Good: 필요한 의존성만 정확히
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// ❌ Bad: 빈 배열로 경고 무시
useEffect(() => {
  fetchUser(userId);
}, []); // eslint-disable-line
```

### useCallback/useMemo 사용
```typescript
// 참조 안정성 필요할 때만 사용
const handleSubmit = useCallback(async (data: FormData) => {
  await submitForm(data);
}, [submitForm]);

// 비용이 큰 계산에만 useMemo
const sortedItems = useMemo(() => {
  return items.slice().sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

## Next.js App Router

### 라우트 그룹
```
app/
├── (auth)/           # 인증 레이아웃 공유
│   ├── layout.tsx
│   ├── login/
│   └── signup/
├── (dashboard)/      # 대시보드 레이아웃 공유
│   ├── layout.tsx
│   └── dashboard/
└── (marketing)/      # 마케팅 레이아웃 공유
    ├── layout.tsx
    └── pricing/
```

### 메타데이터
```typescript
// 정적 메타데이터
export const metadata: Metadata = {
  title: '대시보드',
  description: '수학 학습 현황을 확인하세요',
};

// 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = await getLesson(params.id);
  return {
    title: lesson.title,
    description: lesson.description,
  };
}
```

### Loading & Error UI
```typescript
// loading.tsx
export default function Loading() {
  return <Skeleton className="h-screen" />;
}

// error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}

// not-found.tsx
export default function NotFound() {
  return <div>페이지를 찾을 수 없습니다</div>;
}
```

## 폼 처리

### Server Actions (권장)
```typescript
// actions.ts
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function submitForm(formData: FormData) {
  const result = schema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // 처리 로직
  return { success: true };
}
```

### React Hook Form + Zod
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '8자 이상 입력하세요'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // 제출 로직
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```
