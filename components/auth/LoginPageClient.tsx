"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "./LoginForm"

export function LoginPageClient() {
  const searchParams = useSearchParams()
  const signupSuccess = searchParams.get("signup") === "success"

  return <LoginForm signupSuccess={signupSuccess} />
}
