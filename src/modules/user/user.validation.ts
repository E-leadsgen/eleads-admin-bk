import { z } from "zod/v4";

// ── Schemas ──

export const getAllUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

// ── Types ──

export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;

// ── Validators ──

function mapIssues(issues: z.core.$ZodIssue[]) {
  return issues.map((i) => ({ field: i.path.join("."), message: i.message }));
}

export function validateGetAllUsersQuery(data: unknown) {
  const result = getAllUsersQuerySchema.safeParse(data);
  if (!result.success) {
    return { errors: mapIssues(result.error.issues), data: null };
  }
  return { errors: null, data: result.data };
}
