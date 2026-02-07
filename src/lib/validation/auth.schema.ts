import { z } from "zod";

// Shared field schemas
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .regex(/^\S+$/, "Username cannot contain spaces")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, hyphens, and underscores",
  );

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format");

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .regex(
    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+([\s'-][a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes",
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Signup schema with password confirmation
export const signupSchema = z
  .object({
    username: usernameSchema,
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login schema (simple)
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Inferred TypeScript types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Partial schemas for progressive validation (useful for real-time field validation)
export const signupFieldSchema = {
  username: usernameSchema,
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
} as const;

export const loginFieldSchema = {
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
} as const;
