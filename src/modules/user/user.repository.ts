import { UserCreateInput, UserModel } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

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
}

export default new UserRepository();
