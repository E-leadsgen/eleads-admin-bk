import { UserCreateInput } from "../../../generated/prisma/models";
import UserRepository from "./user.repository";
import type { GetAllUsersQuery } from "./user.validation";

class UserService {
  async findByEmail(email: string) {
    return await UserRepository.findByEmail(email);
  }

  async create(data: UserCreateInput) {
    return await UserRepository.create(data);
  }

  async findAllFiltered(query: GetAllUsersQuery) {
    return await UserRepository.findAllFiltered(query);
  }
}

export default new UserService();
