"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import { Button } from "./button"
import { Input } from "./input"

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

const RegisterSchema = LoginSchema.extend({
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .refine((data) => /[A-Z]/.test(data), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((data) => /[a-z]/.test(data), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((data) => /[0-9]/.test(data), {
      message: "Password must contain at least one number.",
    }),
}).refine(
  (data) => data.confirmPassword === data.password,
  {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  }
);

interface UserAuthFormState {
  isLoading: boolean
  onSuccess: (success: boolean) => void
  onFail: (error: string) => void
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "register"
  formState: UserAuthFormState
}

function UserLoginAuthForm({ formState, className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    console.log(data)
    try {
      formState.onSuccess(true)
    } catch (error: any) {
      formState.onFail(error.message || "Login failed.")
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-1">
          <Input
            id="email"
            placeholder="john.doe@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={formState.isLoading}
            {...form.register("email")}
          />
          <p className="text-red-600">{form.formState.errors.email?.message}</p>
        </div>
        <div className="grid gap-1">
          <Input
            id="password"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            disabled={formState.isLoading}
            {...form.register("password")}
          />
          <p className="text-red-600">{form.formState.errors.password?.message}</p>
        </div>
        <Button disabled={formState.isLoading} className="w-full">
          {formState.isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In with Email
        </Button>
      </form>
    </div>
  )
}

function UserRegisterAuthForm({ formState, className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    console.log(data)
    try {
      formState.onSuccess(true)
    } catch (error: any) {
      formState.onFail(error.message || "Registration failed.")
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-1">
          <Input
            id="email"
            placeholder="john.doe@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={formState.isLoading}
            {...form.register("email")}
          />
          <p className="text-red-600">{form.formState.errors.email?.message}</p>
        </div>
        <div className="grid gap-1">
          <Input
            id="password"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            disabled={formState.isLoading}
            {...form.register("password")}
          />
          <p className="text-red-600">{form.formState.errors.password?.message}</p>
        </div>
        <div className="grid gap-1">
          <Input
            id="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            autoComplete="new-password"
            disabled={formState.isLoading}
            {...form.register("confirmPassword")}
          />
          <p className="text-red-600">{form.formState.errors.confirmPassword?.message?.toString()}</p>
        </div>
        <Button disabled={formState.isLoading} className="w-full">
          {formState.isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register with Email
        </Button>
      </form>
    </div>
  )
}

export function UserAuthForm({ mode, formState, className, ...props }: UserAuthFormProps) {
  return (
    <>
      {mode === "login" ? (
        <UserLoginAuthForm mode={"login"} formState={formState} className={className} {...props} />
      ) : (
        <UserRegisterAuthForm mode={"register"} formState={formState} className={className} {...props} />
      )}
    </>
  )
}
