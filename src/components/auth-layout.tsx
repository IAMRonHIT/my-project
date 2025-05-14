'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { Field, Fieldset, Label } from './fieldset';
import { Heading, Subheading } from './heading';
import { Input } from './input';
import { Link } from './link';

type FormType = 'login' | 'register' | 'forgotPassword';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const [currentForm, setCurrentForm] = useState<FormType>('login');

  const switchToRegister = () => setCurrentForm('register');
  const switchToLogin = () => setCurrentForm('login');
  const switchToForgotPassword = () => setCurrentForm('forgotPassword');

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-2">
      <div className="w-full max-w-md p-8 lg:p-12 lg:rounded-lg lg:bg-white/80 lg:shadow-lg lg:ring-1 lg:ring-zinc-950/10 dark:lg:bg-zinc-900/80 dark:lg:ring-white/10 lg:backdrop-blur-sm min-h-[650px] flex flex-col justify-center">
        {currentForm === 'login' && (
          <>
            <div className="mb-6 text-center">
              <Image src="/logo.svg" alt="Logo" width={240} height={240} className="mx-auto mb-4" />
              <Heading>Sign in to your account</Heading>
              <Subheading className="mt-2 text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{' '}
                <Link href="#" onClick={switchToRegister} className="font-semibold text-blue-600 dark:text-blue-400">
                  Sign up
                </Link>
              </Subheading>
            </div>
            <Fieldset className="mt-8">
              <Field>
                <Label htmlFor="login-email">Email address</Label>
                <Input type="email" id="login-email" name="email" autoComplete="email" required />
              </Field>
              <Field className="mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link
                    href="#"
                    onClick={switchToForgotPassword}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input type="password" id="login-password" name="password" autoComplete="current-password" required />
              </Field>
              <div className="mt-6">
                <Button type="submit" color="blue" className="w-full">
                  Sign In
                </Button>
              </div>
            </Fieldset>
          </>
        )}

        {currentForm === 'register' && (
          <>
            <div className="mb-6 text-center">
              <Image src="/logo.svg" alt="Logo" width={240} height={240} className="mx-auto mb-4" />
              <Heading>Create an account</Heading>
              <Subheading className="mt-2 text-zinc-600 dark:text-zinc-400">
                Already have an account?{' '}
                <Link href="#" onClick={switchToLogin} className="font-semibold text-blue-600 dark:text-blue-400">
                  Sign in
                </Link>
              </Subheading>
            </div>
            <Fieldset className="mt-8">
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" autoComplete="name" required />
              </Field>
              <Field className="mt-4">
                <Label htmlFor="register-email">Email address</Label>
                <Input type="email" id="register-email" name="email" autoComplete="email" required />
              </Field>
              <Field className="mt-4">
                <Label htmlFor="register-password">Password</Label>
                <Input type="password" id="register-password" name="password" autoComplete="new-password" required />
              </Field>
              <Field className="mt-4">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" required />
              </Field>
              <div className="mt-6">
                <Button type="submit" color="blue" className="w-full">
                  Sign Up
                </Button>
              </div>
            </Fieldset>
          </>
        )}

        {currentForm === 'forgotPassword' && (
          <>
            <div className="mb-6 text-center">
              <Image src="/logo.svg" alt="Logo" width={240} height={240} className="mx-auto mb-4" />
              <Heading>Forgot your password?</Heading>
              <Subheading className="mt-2 text-zinc-600 dark:text-zinc-400">
                Enter your email address and we&apos;ll send you a link to reset it.
              </Subheading>
            </div>
            <Fieldset className="mt-8">
              <Field>
                <Label htmlFor="forgot-email">Email address</Label>
                <Input type="email" id="forgot-email" name="email" autoComplete="email" required />
              </Field>
              <div className="mt-6">
                <Button type="submit" color="blue" className="w-full">
                  Send Reset Link
                </Button>
              </div>
              <div className="mt-4 text-center">
                <Link href="#" onClick={switchToLogin} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Back to Sign In
                </Link>
              </div>
            </Fieldset>
          </>
        )}
        {children}
      </div>
    </main>
  );
}
