'use client';

import { useClerk, useSignUp, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpVerificationService, updateVerificationInfoService } from '@/services/auth-service';
import { SignUpType, signUpSchema } from '@/validators/auth-validator';
import { AUTH_MESSAGES } from '@/constants/messages/auth-message';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

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
      classroom: '',
      verificationCode: '',
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

    // Validate classroom code and verification ID before proceeding
    const validationResponse = await signUpVerificationService(data.verificationCode, data.classroom);

    // Handle validation response
    switch (validationResponse.message) {
      case 'ERROR.CODE_NOT_FOUND':
        setServerError(AUTH_MESSAGES.ERROR.CODE_NOT_FOUND);
        return;
      case 'ERROR.INVALID_CODE':
        setServerError(AUTH_MESSAGES.ERROR.INVALID_CODE);
        return;
      case 'ERROR.CLASSROOM_NOT_MATCH':
        setServerError(AUTH_MESSAGES.ERROR.CLASSROOM_NOT_MATCH);
        return;
      case 'ERROR.UNKNOWN':
        setServerError(AUTH_MESSAGES.ERROR.UNKNOWN);
        return;
      default:
    }

    try {
      // Avoid single-session problem, sign out before sign-up
      // if (isSignedIn) await signOut();
      if (isSignedIn) await session?.remove();
      // Proceed with sign-up if validation is successful
      const signUpResponse = await signUp.create({
        username: data.username,
        password: data.password,
        unsafeMetadata: {
          role: validationResponse.data?.role,
          classroom: data.classroom,
        },
      });

      // Check if sign-up is complete,set error message if not
      if (signUpResponse.status !== 'complete') {
        setServerError('Signup failed');
        return;
      }

      // Update verification information
      const result = await updateVerificationInfoService(validationResponse.data?._id as string, false);
      if (result?.result) {
        toast.success(result.message);
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
          <CardTitle className='text-center text-2xl'>Sign Up to Parking Save</CardTitle>
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

              {/* Classroom Code Field */}
              <FormField
                control={form.control}
                name='classroom'
                render={({ field }) => (
                  <FormItem>
                    <Label>Classroom Code</Label>
                    <Input {...field} placeholder='4 characters' />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verification Code Field */}
              <FormField
                control={form.control}
                name='verificationCode'
                render={({ field }) => (
                  <FormItem>
                    <Label>VerificationCode Code</Label>
                    <Input {...field} placeholder='6-digit alphanumeric ID' />
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