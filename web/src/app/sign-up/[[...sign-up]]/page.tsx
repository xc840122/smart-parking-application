'use client';

import { useClerk, useSignUp, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpType, signUpSchema } from '@/validators/auth.validator';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { session } = useClerk();
  const { isSignedIn } = useUser();

  // Initialize react-hook-form with Zod validation
  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: SignUpType) {
    setServerError(null);

    // Ensure sign-up service is loaded
    if (!isLoaded) {
      setServerError('The sign-up service is loading. Please try again later.');
      return;
    }

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }

    try {
      // Avoid single-session problem, sign out before sign-up
      // if (isSignedIn) await signOut();
      if (isSignedIn) await session?.remove();
      // Proceed with sign-up if validation is successful
      const signUpResponse = await signUp.create({
        username: data.username,
        password: data.password,
      });

      // Check if sign-up is complete,set error message if not
      if (signUpResponse.status !== 'complete') {
        setServerError('Signup failed');
        return;
      }

      // Set active session
      if (signUpResponse.createdSessionId) {
        await setActive({ session: signUpResponse.createdSessionId });
      }

      // Redirect user to home page
      router.replace('/');
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message || 'Signup failed');
      } else {
        setServerError('Signup failed');
      }
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>Sign Up to Digital Campus</CardTitle>
        </CardHeader>
        <CardContent>
          {serverError && <p className='text-red-500 text-sm text-center mb-3'>{serverError}</p>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Username Field */}
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <Label>Username</Label>
                    <Input {...field} placeholder='Username must be 3-16 characters' />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <Input {...field} type='password' placeholder='Password must be at least 8 characters' />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <Label>Confirm Password</Label>
                    <Input {...field} type='password' placeholder='Confirm your password' />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CAPTCHA */}
              <div id="clerk-captcha"></div>

              {/* Submit Button */}
              <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}