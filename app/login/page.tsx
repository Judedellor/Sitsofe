import { Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { LoginPageClient } from "@/components/auth/LoginPageClient"

export default function LoginPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Sign In to Your Account</h1>
      <Suspense fallback={<LoginForm signupSuccess={false} />}>
        <LoginPageClient />
      </Suspense>
    </div>
  )
}
