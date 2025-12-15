# Database Rules (Supabase)

## 스키마 설계

### 필수 컬럼
모든 테이블에 포함:
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### updated_at 자동 갱신
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 외래 키 규칙
```sql
-- 부모 삭제 시 자식도 삭제
REFERENCES parent_table(id) ON DELETE CASCADE

-- 부모 삭제 시 NULL로 설정
REFERENCES parent_table(id) ON DELETE SET NULL

-- 부모 삭제 방지 (자식 있으면 에러)
REFERENCES parent_table(id) ON DELETE RESTRICT
```

## Row Level Security (RLS)

### 항상 활성화
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;
```

### 정책 패턴
```sql
-- 자신의 데이터만 조회
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 자신의 데이터만 수정
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- 인증된 사용자만 생성
CREATE POLICY "Authenticated users can insert"
ON user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 공개 읽기 (레퍼런스 테이블)
CREATE POLICY "Anyone can view topics"
ON topics FOR SELECT
USING (true);
```

## 쿼리 패턴

### 기본 CRUD
```typescript
import { createClient } from '@/lib/supabase/server';

// Read
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Create
const { data, error } = await supabase
  .from('profiles')
  .insert({ email, display_name: displayName })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('profiles')
  .update({ display_name: newName })
  .eq('id', userId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', userId);
```

### 관계 쿼리
```typescript
// 조인 (Foreign Key 관계)
const { data } = await supabase
  .from('lessons')
  .select(`
    *,
    topic:topics(name, icon),
    problems:problems(id, question, difficulty)
  `)
  .eq('id', lessonId)
  .single();

// 필터링된 관계
const { data } = await supabase
  .from('topics')
  .select(`
    *,
    lessons:lessons(*)
  `)
  .eq('math_level', 'middle')
  .order('order_index');
```

### 페이지네이션
```typescript
const PAGE_SIZE = 20;

const { data, count } = await supabase
  .from('problems')
  .select('*', { count: 'exact' })
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
  .order('created_at', { ascending: false });
```

### 검색
```typescript
// 텍스트 검색
const { data } = await supabase
  .from('problems')
  .select('*')
  .textSearch('question', query, { type: 'websearch' });

// ILIKE 패턴 검색
const { data } = await supabase
  .from('topics')
  .select('*')
  .ilike('name', `%${searchTerm}%`);
```

## 타입 안전성

### 타입 생성
```bash
# Supabase CLI로 타입 생성
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### 타입 사용
```typescript
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// 클라이언트에 타입 적용
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## 에러 처리

### 패턴
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (error) {
  // PostgreSQL 에러 코드 확인
  if (error.code === 'PGRST116') {
    // 결과 없음
    return null;
  }
  if (error.code === '23505') {
    // 중복 키 위반
    throw new Error('이미 존재하는 데이터입니다');
  }
  // 일반 에러
  throw new DatabaseError(error.message);
}

return data;
```

### 트랜잭션 (RPC 사용)
```sql
-- Supabase 함수 정의
CREATE OR REPLACE FUNCTION complete_lesson(
  p_user_id UUID,
  p_lesson_id UUID,
  p_score INT
)
RETURNS VOID AS $$
BEGIN
  -- 진행률 업데이트
  UPDATE user_progress
  SET
    completed_at = NOW(),
    best_score = GREATEST(best_score, p_score)
  WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

  -- XP 추가
  UPDATE profiles
  SET total_xp = total_xp + 10
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

```typescript
// TypeScript에서 호출
const { error } = await supabase.rpc('complete_lesson', {
  p_user_id: userId,
  p_lesson_id: lessonId,
  p_score: score,
});
```

## 인덱스

### 자주 조회되는 컬럼
```sql
-- 외래 키
CREATE INDEX idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX idx_problems_lesson_id ON problems(lesson_id);

-- 자주 필터링되는 컬럼
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);

-- 복합 인덱스
CREATE INDEX idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);
```
