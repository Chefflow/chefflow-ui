"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@/domain/auth/errors";
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
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: AuthError = {
      code: response.status === 409 ? "USERNAME_TAKEN" : "SERVER_ERROR",
      message: errorData.message || "Request failed",
      field: errorData.field,
    };
    throw error;
  }

  return response.json();
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
      ...signupData
    } = result.data;

    const response = await apiRequest<{ user: User }>(
      "/auth/register",
      signupData,
    );

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

    const response = await apiRequest<{ user: User }>(
      "/auth/login",
      result.data,
    );

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
    console.error("Logout failed:", error);
  } finally {
    redirect("/login");
  }
}
