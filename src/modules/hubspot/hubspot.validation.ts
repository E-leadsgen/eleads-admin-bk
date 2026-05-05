import { z } from "zod/v4";

// ── Company search by email ──

export const companyByEmailSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email("Must be a valid email address")
    .max(320, "Email must be at most 320 characters"),
});

// ── Company ID param ──

export const companyIdParamSchema = z.object({
  companyId: z
    .string({ error: "Company ID is required" })
    .trim()
    .min(1, "Company ID is required"),
});

// ── Company contacts query ──

export const companyContactsQuerySchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z
    .string()
    .trim()
    .email("Must be a valid email address")
    .max(320)
    .optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  after: z.string().trim().optional(),
});

// ── Company appointments query ──

export const companyAppointmentsQuerySchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  status: z.string().trim().min(1).max(100).optional(),
  sortOrder: z.enum(["ASCENDING", "DESCENDING"]).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  after: z.string().trim().optional(),
});

// ── Types ──

export type CompanyByEmailInput = z.infer<typeof companyByEmailSchema>;
export type CompanyContactsQuery = z.infer<typeof companyContactsQuerySchema>;
export type CompanyAppointmentsQuery = z.infer<
  typeof companyAppointmentsQuerySchema
>;

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

export function validateCompanyByEmail(body: unknown) {
  return parseSchema(companyByEmailSchema, body);
}

export function validateCompanyContactsQuery(query: unknown) {
  return parseSchema(companyContactsQuerySchema, query);
}

export function validateCompanyAppointmentsQuery(query: unknown) {
  return parseSchema(companyAppointmentsQuerySchema, query);
}

export function validateCompanyIdParam(params: unknown) {
  return parseSchema(companyIdParamSchema, params);
}
