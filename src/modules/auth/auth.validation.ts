import { z } from "zod/v4";

export const signUpSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .check(z.email({ error: "Email is not valid" })),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export const confirmSignUpSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .check(z.email({ error: "Email is not valid" })),

  confirmationCode: z
    .string({ error: "Confirmation code is required" })
    .trim()
    .min(1, "Confirmation code is required"),
});

export const signInSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .check(z.email({ error: "Email is not valid" })),

  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type ConfirmSignUpInput = z.infer<typeof confirmSignUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

export function validateSignUp(body: unknown): {
  errors: Record<string, unknown>[] | null;
  data: SignUpInput | null;
} {
  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { errors, data: null };
  }

  return { errors: null, data: result.data };
}

export function validateConfirmSignUp(body: unknown): {
  errors: Record<string, unknown>[] | null;
  data: ConfirmSignUpInput | null;
} {
  const result = confirmSignUpSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { errors, data: null };
  }

  return { errors: null, data: result.data };
}

export function validateSignIn(body: unknown): {
  errors: Record<string, unknown>[] | null;
  data: SignInInput | null;
} {
  const result = signInSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { errors, data: null };
  }

  return { errors: null, data: result.data };
}
