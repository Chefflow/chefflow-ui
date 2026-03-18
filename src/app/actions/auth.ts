"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthError } from "@/domain/auth/errors";
import { hashPassword } from "@/lib/crypto/hash-password.server";
import { handleError } from "@/lib/errors/error-handler";
import {
  type LoginInput,
  loginSchema,
  type SignupInput,
  signupSchema,
} from "@/lib/validation/auth.schema";
import type { User } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export interface ActionState {
  success: boolean;
  error?: ReturnType<typeof handleError>;
  user?: User;
  fieldErrors?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  data: Record<string, unknown>,
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookieStore = await cookies();
    
    setCookieHeader.split(',').forEach(cookie => {
      const [cookiePair] = cookie.trim().split(';');
      const [name, value] = cookiePair.split('=');
      if (name && value) {
        cookieStore.set(name.trim(), value.trim(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: AuthError = {
      code: response.status === 409 ? "USERNAME_TAKEN" : "SERVER_ERROR",
      message: errorData.message || "Request failed",
      field: errorData.field,
    };
    throw error;
  }

  const responseData = await response.json();

  return responseData;
}

export async function signupAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const rawData: SignupInput = {
      username: formData.get("username") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      acceptTerms: formData.get("acceptTerms") === "on",
    };

    const result = signupSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce(
        (acc, issue) => {
          const field = issue.path[0] as string;
          acc[field] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return {
        success: false,
        fieldErrors,
        error: handleError({
          code: "VALIDATION_ERROR",
          message: result.error.issues[0].message,
          field: result.error.issues[0].path[0] as string,
        }),
      };
    }

    const {
      confirmPassword: _removed,
      acceptTerms: _terms,
      password,
      ...restData
    } = result.data;

    const hashedPassword = hashPassword(password);

    const response = await apiRequest<{ user: User }>("/auth/register", {
      ...restData,
      password: hashedPassword,
    });

    return {
      success: true,
      user: response.user,
    };
  } catch (error) {
    return {
      success: false,
      error: handleError(error),
    };
  }
}

export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const rawData: LoginInput = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce(
        (acc, issue) => {
          const field = issue.path[0] as string;
          acc[field] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return {
        success: false,
        fieldErrors,
        error: handleError({
          code: "VALIDATION_ERROR",
          message: result.error.issues[0].message,
          field: result.error.issues[0].path[0] as string,
        }),
      };
    }

    const hashedPassword = hashPassword(result.data.password);

    const response = await apiRequest<{ user: User }>("/auth/login", {
      username: result.data.username,
      password: hashedPassword,
    });

    return {
      success: true,
      user: response.user,
    };
  } catch (error) {
    return {
      success: false,
      error: handleError(error),
    };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    // Silently fail logout
  } finally {
    redirect("/login");
  }
}
