"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import { Button } from "./button"
import { Input } from "./input"

import { LoginSchema, RegisterSchema, useAuth } from "@/contexts/AuthProvider"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "register"
}

function UserLoginAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { loginWithUsernameAndPassword } = useAuth();

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    loginWithUsernameAndPassword(data);
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
            disabled={false}
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
            disabled={false}
            {...form.register("password")}
          />
          <p className="text-red-600">{form.formState.errors.password?.message}</p>
        </div>
        <Button disabled={false} className="w-full">
          {false && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In with Email
        </Button>
      </form>
    </div>
  )
}

function UserRegisterAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  const { registerWithUsernameAndPassword } = useAuth();

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    registerWithUsernameAndPassword(data);
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
            disabled={false}
            {...form.register("email")}
          />
          <p className="text-red-600">{form.formState.errors.email?.message}</p>
        </div>
        <div className="grid gap-1">
          <Input
            id="username"
            placeholder="Username"
            type="text"
            autoComplete="username"
            disabled={false}
            {...form.register("username")}
          />
        </div>
        <div className="grid gap-1">
          <Input
            id="password"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            disabled={false}
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
            disabled={false}
            {...form.register("confirmPassword")}
          />
          <p className="text-red-600">{form.formState.errors.confirmPassword?.message?.toString()}</p>
        </div>
        <Button disabled={false} className="w-full">
          {false && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register with Email
        </Button>
      </form>
    </div>
  )
}

export function UserAuthForm({ mode, className, ...props }: UserAuthFormProps) {
  return (
    <>
      {mode === "login" ? (
        <UserLoginAuthForm mode={"login"} className={className} {...props} />
      ) : (
        <UserRegisterAuthForm mode={"register"} className={className} {...props} />
      )}
    </>
  )
}
