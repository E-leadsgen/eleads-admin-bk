import { prisma } from "../../lib/prisma";
import {
  UserLeadModel,
  UserLeadUncheckedCreateInput,
  UserLeadUncheckedUpdateInput,
} from "../../../generated/prisma/models/UserLead";
import type { UserLeadQueryInput } from "./lead.validation";

class UserLeadRepository {
  async findById(id: string): Promise<UserLeadModel | null> {
    return await prisma.userLead.findUnique({
      where: { id },
      include: { user: true, lead: true },
    });
  }

  async findAllByUserId(userId: string, query: UserLeadQueryInput) {
    const {
      page,
      limit,
      name,
      status,
      dateFrom,
      dateTo,
      revenueMin,
      revenueMax,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      idUser: userId,
      ...(revenueMin !== undefined || revenueMax !== undefined
        ? {
            revenue: {
              ...(revenueMin !== undefined ? { gte: revenueMin } : {}),
              ...(revenueMax !== undefined ? { lte: revenueMax } : {}),
            },
          }
        : {}),
      lead: {
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
      },
    };

    const [items, total] = await Promise.all([
      prisma.userLead.findMany({
        where,
        include: { lead: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.userLead.count({ where }),
    ]);

    return {
      items,
      hasNextPage: skip + items.length < total,
    };
  }

  async create(data: UserLeadUncheckedCreateInput): Promise<UserLeadModel> {
    return await prisma.userLead.create({
      data,
      include: { user: true, lead: true },
    });
  }

  async update(
    id: string,
    data: UserLeadUncheckedUpdateInput,
  ): Promise<UserLeadModel> {
    return await prisma.userLead.update({
      where: { id },
      data,
      include: { user: true, lead: true },
    });
  }

  async delete(id: string): Promise<UserLeadModel> {
    return await prisma.userLead.delete({ where: { id } });
  }
}

export default new UserLeadRepository();
