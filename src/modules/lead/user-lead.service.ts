import {
  UserLeadUncheckedCreateInput,
  UserLeadUncheckedUpdateInput,
} from "../../../generated/prisma/models/UserLead";
import type { UserLeadQueryInput } from "./lead.validation";
import UserLeadRepository from "./user-lead.repository";

class UserLeadService {
  async findById(id: string) {
    return await UserLeadRepository.findById(id);
  }

  async findAllByUserId(userId: string, query: UserLeadQueryInput) {
    return await UserLeadRepository.findAllByUserId(userId, query);
  }

  async create(data: UserLeadUncheckedCreateInput) {
    return await UserLeadRepository.create(data);
  }

  async update(id: string, data: UserLeadUncheckedUpdateInput) {
    return await UserLeadRepository.update(id, data);
  }

  async delete(id: string) {
    return await UserLeadRepository.delete(id);
  }
}

export default new UserLeadService();
