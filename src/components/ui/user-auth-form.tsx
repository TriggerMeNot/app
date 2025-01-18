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

import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "register"
}

function UserLoginAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { loginWithUsernameAndPassword, isLoading } = useAuth();

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
            disabled={isLoading}
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
            disabled={isLoading}
            {...form.register("password")}
          />
          <p className="text-red-600">{form.formState.errors.password?.message}</p>
        </div>
        <Button disabled={isLoading} className="w-full">
          {isLoading && (
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

  const { registerWithUsernameAndPassword, isLoading } = useAuth();

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
            disabled={isLoading}
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
            disabled={isLoading}
            {...form.register("username")}
          />
        </div>
        <div className="grid gap-1">
          <Input
            id="password"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
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
            disabled={isLoading}
            {...form.register("confirmPassword")}
          />
          <p className="text-red-600">{form.formState.errors.confirmPassword?.message?.toString()}</p>
        </div>
        <Button disabled={isLoading} className="w-full">
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register with Email
        </Button>
      </form>
    </div>
  )
}

export function UserAuthForm({ mode, className, ...props }: UserAuthFormProps) {
  const { isLoading, services } = useAuth();

  return (
    <>
      {mode === "login" ? (
        <UserLoginAuthForm mode={"login"} className={className} {...props} />
      ) : (
        <UserRegisterAuthForm mode={"register"} className={className} {...props} />
      )}
      {services.map((service) => {
        if (!service?.oauths?.authenticate_uri) return null;
        return (
          <Button
            key={service.name}
            disabled={isLoading}
            className="w-full"
            onClick={async () => {
              if (service.oauths?.authenticate_uri) {
                if (Capacitor.isNativePlatform()) {
                  await Browser.open({ url: service.oauths.authenticate_uri });
                } else {
                  window.location.assign(service.oauths.authenticate_uri);
                }
              }
            }}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              Icons[service.name.toLowerCase() as keyof typeof Icons]
                ? React.createElement(Icons[service.name.toLowerCase() as keyof typeof Icons || Icons["default"]], { className: "mr-2 h-4 w-4" })
                : null
            )}
            Sign In with {service.name}
          </Button>
        )
      })}
    </>
  )
}
