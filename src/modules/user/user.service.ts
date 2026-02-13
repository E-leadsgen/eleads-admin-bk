import { UserCreateInput } from "../../../generated/prisma/models";
import UserRepository from "./user.repository";

class UserService {
  async findByEmail(email: string) {
    return await UserRepository.findByEmail(email);
  }

  async create(data: UserCreateInput) {
    return await UserRepository.create(data);
  }
}

export default new UserService();
