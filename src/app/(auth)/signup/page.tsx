import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "회원가입",
  description: "MathMentor에 가입하고 수학 실력을 키워보세요",
};

export default function SignupPage() {
  return <SignupForm />;
}
