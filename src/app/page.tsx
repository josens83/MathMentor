import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
            <span className="text-xl font-bold">MathMentor</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              기능
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              요금제
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              소개
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
            <Link href="/signup">
              <Button>무료로 시작하기</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="mb-4" variant="secondary">
              AI 기반 수학 학습 플랫폼
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              수학을 <span className="text-primary">재미있게</span>,
              <br />
              AI와 함께 <span className="text-secondary">똑똑하게</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              MathMentor는 AI 튜터와 게이미피케이션을 결합하여 수학 학습을
              혁신합니다. 당신만의 맞춤형 학습 경험을 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="xl" className="w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  데모 체험하기
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              신용카드 없이 무료로 시작 • 언제든 업그레이드 가능
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                왜 MathMentor인가요?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                최신 AI 기술과 검증된 학습 방법론을 결합한 차세대 수학 학습
                플랫폼입니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <CardTitle>AI 맞춤 튜터</CardTitle>
                  <CardDescription>
                    Claude AI가 풀이 과정을 분석하고 실시간 힌트와 피드백을
                    제공합니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <CardTitle>게이미피케이션</CardTitle>
                  <CardDescription>
                    XP, 레벨, 스트릭, 업적으로 학습 동기를 부여합니다. Duolingo
                    스타일의 재미있는 학습!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <CardTitle>맞춤형 학습 경로</CardTitle>
                  <CardDescription>
                    AI가 약점을 분석하고 최적화된 학습 경로를 추천해드립니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">✍️</span>
                  </div>
                  <CardTitle>단계별 풀이</CardTitle>
                  <CardDescription>
                    수학 개념을 완벽하게 이해할 수 있는 단계별 문제 풀이와
                    설명을 제공합니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">🔢</span>
                  </div>
                  <CardTitle>수학 수식 입력</CardTitle>
                  <CardDescription>
                    KaTeX 기반 수식 렌더링과 직관적인 수학 키보드로 편리하게
                    입력하세요.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <CardTitle>모든 기기 지원</CardTitle>
                  <CardDescription>
                    데스크톱, 태블릿, 모바일 어디서나 동일한 학습 경험을
                    제공합니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                합리적인 요금제
              </h2>
              <p className="text-muted-foreground">
                무료로 시작하고, 필요할 때 업그레이드하세요.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <Card>
                <CardHeader>
                  <CardTitle>무료</CardTitle>
                  <CardDescription>기본 학습 기능</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₩0</span>
                    <span className="text-muted-foreground">/월</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 기본 문제 풀이
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 하루 5문제
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 기본 AI 힌트
                    </li>
                  </ul>
                  <Link href="/signup" className="block mt-6">
                    <Button variant="outline" className="w-full">
                      시작하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro */}
              <Card className="border-primary relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  인기
                </Badge>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>무제한 학습</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₩9,900</span>
                    <span className="text-muted-foreground">/월</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 무제한 문제 풀이
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 고급 AI 튜터
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 상세 풀이 해설
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 약점 분석
                    </li>
                  </ul>
                  <Link href="/signup?plan=pro" className="block mt-6">
                    <Button className="w-full">Pro 시작하기</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Premium */}
              <Card>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>최상의 학습 경험</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₩19,900</span>
                    <span className="text-muted-foreground">/월</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> Pro의 모든 기능
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 1:1 AI 질문 무제한
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 맞춤 학습 계획
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-success">✓</span> 우선 지원
                    </li>
                  </ul>
                  <Link href="/signup?plan=premium" className="block mt-6">
                    <Button variant="secondary" className="w-full">
                      Premium 시작하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              MathMentor와 함께라면 수학이 두렵지 않습니다. 지금 무료로
              시작해보세요.
            </p>
            <Link href="/signup">
              <Button
                size="xl"
                variant="outline"
                className="bg-white text-primary hover:bg-white/90"
              >
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  M
                </div>
                <span className="text-xl font-bold">MathMentor</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                AI와 함께하는 새로운 수학 학습 경험
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    기능
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    요금제
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-foreground">
                    데모
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    블로그
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    문의
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 MathMentor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
