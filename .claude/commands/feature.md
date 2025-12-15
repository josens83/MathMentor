# 새 기능 구현

4단계 워크플로우를 따라 새 기능을 구현합니다.

## 요청된 기능
$ARGUMENTS

## 워크플로우 실행

### 1단계: Explore (탐색)
먼저 관련 코드를 탐색하여 현재 구조를 파악합니다:
- 관련 컴포넌트 및 모듈 검색
- 유사 기능 구현 패턴 확인
- 의존성 및 영향 범위 분석

### 2단계: Plan (계획)
CRISPE 프레임워크를 적용하여 구현 계획을 수립합니다:
- Context: 현재 MathMentor 상태와 관련 코드
- Role: EdTech 전문 풀스택 개발자
- Intent: 요청된 기능 구현
- Specifics: 세부 요구사항 도출
- Personality: 코드 스타일 가이드 준수
- Experiment: 검증 방법 정의

### 3단계: Code (구현)
Vertical Slice 방식으로 구현합니다:
1. 타입/스키마 정의 (Zod)
2. API 라우트 구현 (필요시)
3. UI 컴포넌트 구현
4. 테스트 작성

### 4단계: Commit (커밋)
검증 후 커밋합니다:
- npm run typecheck
- npm run test
- npm run lint

위 단계를 순서대로 진행해주세요.
