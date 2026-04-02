import { prisma } from "../../lib/prisma";
import {
  LeadModel,
  LeadCreateInput,
  LeadUpdateInput,
} from "../../../generated/prisma/models/Lead";
import type { LeadQueryInput } from "./lead.validation";

class LeadRepository {
  async findById(id: string): Promise<LeadModel | null> {
    return await prisma.lead.findUnique({ where: { id } });
  }

  async findAllFiltered(query: LeadQueryInput) {
    const { page, limit, name, status, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(status ? { status } : {}),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      items,
      hasNextPage: skip + items.length < total,
    };
  }

  async findAll(): Promise<LeadModel[]> {
    return await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  }

  async create(data: LeadCreateInput): Promise<LeadModel> {
    return await prisma.lead.create({ data });
  }

  async update(id: string, data: LeadUpdateInput): Promise<LeadModel> {
    return await prisma.lead.update({ where: { id }, data });
  }

  async delete(id: string): Promise<LeadModel> {
    return await prisma.lead.delete({ where: { id } });
  }
}

export default new LeadRepository();
