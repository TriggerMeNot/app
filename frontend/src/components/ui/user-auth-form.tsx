"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

interface UserAuthFormState {
  isLoading: boolean
  onSuccess: (success: boolean) => void
  onFail: (error: string) => void
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "register",
  formState: UserAuthFormState
}

function UserLoginAuthForm({ formState, className, ...props }: UserAuthFormProps)
{
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    formState.onSuccess(true)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="john.doe@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={formState.isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={formState.isLoading}
            />
          </div>
          <Button disabled={formState.isLoading}>
            {formState.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={formState.isLoading}>
        {formState.isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  )
}

function UserRegisterAuthForm({ formState, className, ...props }: UserAuthFormProps)
{
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    formState.onSuccess(true)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="john.doe@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={formState.isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={formState.isLoading}
            />
          </div>
          <Button disabled={formState.isLoading}>
            {formState.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={formState.isLoading}>
        {formState.isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  )
}

export function UserAuthForm({ mode, formState, className, ...props }: UserAuthFormProps) {
  return (
    <>
      {mode === "login" ? (
        <UserLoginAuthForm mode={mode} formState={formState} className={className} {...props} />
      ) : (
        <UserRegisterAuthForm mode={mode} formState={formState} className={className} {...props} />
      )}
    </>
  )
}
