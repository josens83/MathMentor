# Testing Rules

## 테스트 전략

### 피라미드
```
        /\
       /E2E\        10% - 핵심 사용자 플로우
      /------\
     /통합 테스트\    30% - API, 컴포넌트 통합
    /------------\
   / 단위 테스트   \   60% - 유틸리티, 훅, 컴포넌트
  /----------------\
```

### 커버리지 목표
- 전체: 80% 이상
- 비즈니스 로직 (lib/): 90% 이상
- UI 컴포넌트: 70% 이상

## Vitest 설정

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### src/test/setup.ts
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  }),
}));
```

## 테스트 파일 구조

### 컴포넌트와 같은 위치
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── math/
│       ├── MathRenderer.tsx
│       └── MathRenderer.test.tsx
```

### 또는 __tests__ 폴더
```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
```

## 단위 테스트

### 유틸리티 함수
```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLevel, xpToNextLevel, formatNumber } from '../utils';

describe('calculateLevel', () => {
  it('should return level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('should return level 2 for 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('should return level 5 for 1600 XP', () => {
    expect(calculateLevel(1600)).toBe(5);
  });
});

describe('formatNumber', () => {
  it('should format thousands with K', () => {
    expect(formatNumber(1500)).toBe('1.5K');
  });

  it('should format millions with M', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
  });
});
```

### 커스텀 훅
```typescript
// src/hooks/__tests__/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('key')).toBe('"updated"');
  });
});
```

## 컴포넌트 테스트

### React Testing Library
```typescript
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 비동기 컴포넌트
```typescript
// src/components/auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should show loading state when submitting', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));

    await waitFor(() => {
      expect(screen.getByText(/로그인 중/i)).toBeInTheDocument();
    });
  });

  it('should show error message on invalid credentials', async () => {
    // Mock 실패 응답
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    render(<LoginForm />);
    // ... 폼 입력 및 제출

    await waitFor(() => {
      expect(screen.getByText(/올바르지 않습니다/i)).toBeInTheDocument();
    });
  });
});
```

## API 라우트 테스트

```typescript
// src/app/api/ai/hint/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

describe('POST /api/ai/hint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated requests', async () => {
    const request = new Request('http://localhost/api/ai/hint', {
      method: 'POST',
      body: JSON.stringify({ problem: 'test' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid request body', async () => {
    // Mock 인증된 사용자
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const request = new Request('http://localhost/api/ai/hint', {
      method: 'POST',
      body: JSON.stringify({}), // problem 누락
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
```

## 테스트 명명 규칙

```typescript
describe('[테스트 대상]', () => {
  it('should [예상 동작] when [조건]', () => {});
});

// 예시
describe('calculateLevel', () => {
  it('should return 1 when XP is 0', () => {});
  it('should increase level when XP crosses threshold', () => {});
});

describe('Button', () => {
  it('should render children correctly', () => {});
  it('should be disabled when disabled prop is true', () => {});
  it('should call onClick handler when clicked', () => {});
});
```

## 실행 명령어

```bash
# 전체 테스트 실행
npm run test

# Watch 모드
npm run test -- --watch

# 특정 파일만
npm run test -- src/lib/utils.test.ts

# 커버리지
npm run test:cov

# UI 모드
npm run test:ui
```
