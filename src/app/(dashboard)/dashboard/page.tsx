import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "대시보드",
};

export default function DashboardPage() {
  // Sample data - in production this would come from the database
  const stats = {
    level: 5,
    xp: 450,
    xpToNextLevel: 500,
    streak: 7,
    dailyGoal: 5,
    dailyCompleted: 3,
    energy: 4,
    maxEnergy: 5,
    gems: 150,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">안녕하세요! 👋</h1>
        <p className="text-muted-foreground">오늘도 수학 공부 화이팅!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.level}</div>
              <div className="text-sm text-muted-foreground">레벨</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">🔥 {stats.streak}</div>
              <div className="text-sm text-muted-foreground">연속 학습</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">💎 {stats.gems}</div>
              <div className="text-sm text-muted-foreground">젬</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">❤️ {stats.energy}/{stats.maxEnergy}</div>
              <div className="text-sm text-muted-foreground">에너지</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>경험치</span>
            <Badge variant="secondary">레벨 {stats.level}</Badge>
          </CardTitle>
          <CardDescription>
            다음 레벨까지 {stats.xpToNextLevel - stats.xp} XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(stats.xp / stats.xpToNextLevel) * 100}
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-secondary to-primary"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{stats.xp} XP</span>
            <span>{stats.xpToNextLevel} XP</span>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>오늘의 목표</CardTitle>
          <CardDescription>
            {stats.dailyCompleted}/{stats.dailyGoal} 문제 완료
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(stats.dailyCompleted / stats.dailyGoal) * 100}
            className="h-3"
            indicatorClassName="bg-success"
          />
          <div className="mt-4">
            <Link href="/practice">
              <Button className="w-full">
                학습 시작하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📚</span> 이어서 학습
            </CardTitle>
            <CardDescription>마지막으로 학습한 주제를 계속하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/learn">
              <Button variant="outline" className="w-full">
                대수 - 일차방정식
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span> 일일 챌린지
            </CardTitle>
            <CardDescription>특별 보상을 획득하세요!</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/practice?mode=challenge">
              <Button variant="secondary" className="w-full">
                챌린지 시작
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
