import { Button } from "@/components/ui/button"
import { UserAuthForm } from "@/components/ui/user-auth-form"
import { Link } from "react-router-dom"
import { useState } from "react"

function Login() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button
          variant="ghost"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          {mode === "login" ? "Register" : "Login"}
        </Button>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img
              src="/favicon-32x32.png"
              alt="AREA"
              className="h-6 w-6 mr-2"
            />
            AREA
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;I should have lead Apple the same way AREA is being lead&rdquo;
              </p>
              <footer className="text-sm">Steve Jobless</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Enter your email to sign in"
                  : "Enter your email below to create your account"}
              </p>
            </div>
            <UserAuthForm mode={mode} formState={
              {
                isLoading: false,
                onFail: () => {},
                onSuccess: () => {}
              }
            } />
            <p className="px-8 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign up
                  </button>
                  .
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign in
                  </button>
                  .
                </>
              )}
            </p>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
