# 테스트 작성

지정된 파일/기능에 대한 테스트를 작성합니다.

## 테스트 대상
$ARGUMENTS

## 테스트 작성 가이드

### 파일 위치 규칙
- 컴포넌트: 같은 디렉토리에 `[Component].test.tsx`
- 유틸리티: `__tests__/[file].test.ts`
- API: `__tests__/api/[route].test.ts`

### 테스트 구조
```typescript
import { describe, it, expect, vi } from "vitest";

describe("[테스트 대상]", () => {
  describe("[기능/메서드]", () => {
    it("should [예상 동작]", () => {
      // Arrange
      // Act
      // Assert
    });

    it("should handle [엣지 케이스]", () => {
      // ...
    });
  });
});
```

### 필수 테스트 케이스
1. **Happy Path**: 정상 동작
2. **Edge Cases**: 경계값, 빈 값, null/undefined
3. **Error Cases**: 에러 상황 처리
4. **Integration**: 다른 모듈과의 연동

### React 컴포넌트 테스트
```typescript
import { render, screen, fireEvent } from "@testing-library/react";

// 렌더링 테스트
expect(screen.getByRole("button")).toBeInTheDocument();

// 인터랙션 테스트
fireEvent.click(screen.getByRole("button"));
expect(handleClick).toHaveBeenCalled();

// 상태 변화 테스트
expect(screen.getByText("Updated")).toBeInTheDocument();
```

### 검증
```bash
npm run test -- --grep "[테스트 대상]"
npm run test:cov
```

위 가이드에 따라 테스트를 작성해주세요.
