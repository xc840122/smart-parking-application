import { z } from "zod";

// Common username and password rules
const usernameSchema = z.string().min(3, 'Username must be at least 3 characters').max(16, 'Username must be at most 16 characters');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

// Sign up schema
export const signUpSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Sign in schema
export const signInSchema = z.object({
  identifier: usernameSchema,
  password: passwordSchema,
});

export type SignUpType = z.infer<typeof signUpSchema>;

export type SignInType = z.infer<typeof signInSchema>;

