'use client';

import { SignUpButton, useClerk, useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInType } from '@/validators/auth-validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { session } = useClerk();
  const { isSignedIn } = useUser();

  const form = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInType) {
    setServerError(null);

    if (!isLoaded) {
      setServerError('The sign-in service is loading. Please wait...');
      return;
    }

    try {
      // Avoid single-session problem, remove current session before sign-up
      if (isSignedIn) await session?.remove();
      // Attempt to sign in
      const signInResponse = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      // Check if sign-in is complete
      if (signInResponse.status !== 'complete') {
        setServerError('Sign-in failed. Please try again.');
        return;
      }

      // Set active session
      if (signInResponse.createdSessionId) {
        await setActive({ session: signInResponse.createdSessionId });
      }

      // Redirect to home page after successful sign-in
      router.replace('/');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Sign-in failed.');
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome to Digital Campus!</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-gray-500 text-center mb-4">Sign in to your account</h2>

          {/* Display server-side error messages */}
          {serverError && <p className="text-red-500 text-sm text-center mb-3">{serverError}</p>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <Label>Username</Label>
                    <Input {...field} placeholder="Enter your username" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <Input {...field} type="password" placeholder="Enter your password" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* CAPTCHA */}
              <div id="clerk-captcha"></div>

              {/* Sign-In Button */}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Sign In'}
              </Button>

              {/* Sign-Up Link */}
              <div className="flex justify-center items-center mt-2">
                <span>Not join yet?&nbsp;&nbsp;</span>
                <SignUpButton >
                  <span className='text-xs text-gray-500 cursor-pointer'>Sign up</span>
                </SignUpButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

// export default SignInPage;