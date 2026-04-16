import { z } from "zod/v4";

const uuidSchema = z
  .string({ error: "ID is required" })
  .trim()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "ID must be a valid UUID",
  );

// ── Lead schemas ──

export const createLeadSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must be at most 200 characters"),

  email: z
    .string()
    .trim()
    .email("Email must be a valid email address")
    .max(255, "Email must be at most 255 characters")
    .nullable()
    .optional(),

  address: z
    .string({ error: "Address is required" })
    .trim()
    .min(2, "Address must be at least 2 characters")
    .max(500, "Address must be at most 500 characters"),

  product: z
    .string({ error: "Product is required" })
    .trim()
    .min(1, "Product is required")
    .max(200, "Product must be at most 200 characters"),

  phone: z
    .string({ error: "Phone is required" })
    .trim()
    .min(5, "Phone must be at least 5 characters")
    .max(20, "Phone must be at most 20 characters"),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be at most 2000 characters")
    .nullable()
    .optional(),

  status: z
    .enum(["completed", "in_progress", "pending", "cancel", "sale"], {
      error:
        "Status must be one of: completed, in_progress, pending, cancel, sale",
    })
    .optional(),
});

export const updateLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must be at most 200 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Email must be a valid email address")
    .max(255, "Email must be at most 255 characters")
    .nullable()
    .optional(),

  address: z
    .string()
    .trim()
    .min(2, "Address must be at least 2 characters")
    .max(500, "Address must be at most 500 characters")
    .optional(),

  product: z
    .string()
    .trim()
    .min(1, "Product is required")
    .max(200, "Product must be at most 200 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(5, "Phone must be at least 5 characters")
    .max(20, "Phone must be at most 20 characters")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be at most 2000 characters")
    .nullable()
    .optional(),

  status: z
    .enum(["completed", "in_progress", "pending", "cancel", "sale"], {
      error:
        "Status must be one of: completed, in_progress, pending, cancel, sale",
    })
    .optional(),
});

export const leadIdParamSchema = z.object({
  id: uuidSchema,
});

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  status: z
    .enum(["completed", "in_progress", "pending", "cancel", "sale"])
    .optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

// ── UserLead schemas ──

export const createUserLeadSchema = z.object({
  idUser: uuidSchema,
  idLead: uuidSchema,
});

export const updateUserLeadSchema = z.object({
  idUser: z
    .string()
    .trim()
    .check(z.uuid({ error: "idUser must be a valid UUID" }))
    .optional(),

  idLead: z
    .string()
    .trim()
    .check(z.uuid({ error: "idLead must be a valid UUID" }))
    .optional(),

  revenue: z
    .number({ error: "Revenue must be a number" })
    .min(0, "Revenue must be at least 0")
    .optional(),
});

export const userLeadIdParamSchema = z.object({
  id: uuidSchema,
});

export const userIdParamSchema = z.object({
  userId: uuidSchema,
});

export const userLeadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  name: z.string().trim().optional(),
  status: z
    .enum(["completed", "in_progress", "pending", "cancel", "sale"])
    .optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  revenueMin: z.coerce.number().min(0).optional(),
  revenueMax: z.coerce.number().min(0).optional(),
});

// ── Types ──

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
export type CreateUserLeadInput = z.infer<typeof createUserLeadSchema>;
export type UpdateUserLeadInput = z.infer<typeof updateUserLeadSchema>;
export type UserLeadQueryInput = z.infer<typeof userLeadQuerySchema>;

// ── Validators ──

function parseSchema<T>(schema: z.ZodType<T>, data: unknown) {
  const result = (schema as z.ZodObject<any>).safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { errors, data: null };
  }

  return { errors: null, data: result.data as T };
}

export function validateCreateLead(body: unknown) {
  return parseSchema(createLeadSchema, body);
}

export function validateUpdateLead(body: unknown) {
  return parseSchema(updateLeadSchema, body);
}

export function validateLeadIdParam(params: unknown) {
  return parseSchema(leadIdParamSchema, params);
}

export function validateLeadQuery(query: unknown) {
  return parseSchema(leadQuerySchema, query);
}

export function validateCreateUserLead(body: unknown) {
  return parseSchema(createUserLeadSchema, body);
}

export function validateUpdateUserLead(body: unknown) {
  return parseSchema(updateUserLeadSchema, body);
}

export function validateUserLeadIdParam(params: unknown) {
  return parseSchema(userLeadIdParamSchema, params);
}

export function validateUserIdParam(params: unknown) {
  return parseSchema(userIdParamSchema, params);
}

export function validateUserLeadQuery(query: unknown) {
  return parseSchema(userLeadQuerySchema, query);
}
