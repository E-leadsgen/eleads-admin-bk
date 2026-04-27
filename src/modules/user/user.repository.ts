import { UserCreateInput, UserModel } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { GetAllUsersQuery } from "./user.validation";

class UserRepository {
  async findByEmail(email: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: UserCreateInput): Promise<UserModel> {
    return await prisma.user.create({
      data,
    });
  }

  async findAllFiltered(query: GetAllUsersQuery) {
    const { page, limit, name, email, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(email ? { email: { contains: email, mode: "insensitive" } } : {}),
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
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + items.length < total,
    };
  }
}

export default new UserRepository();
