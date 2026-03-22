import {
  LeadCreateInput,
  LeadUpdateInput,
} from "../../../generated/prisma/models/Lead";
import type { LeadQueryInput } from "./lead.validation";
import LeadRepository from "./lead.repository";

class LeadService {
  async findById(id: string) {
    return await LeadRepository.findById(id);
  }

  async findAllByUserId(userId: string, query: LeadQueryInput) {
    return await LeadRepository.findAllByUserId(userId, query);
  }

  async findAll() {
    return await LeadRepository.findAll();
  }

  async create(data: LeadCreateInput) {
    return await LeadRepository.create(data);
  }

  async update(id: string, data: LeadUpdateInput) {
    return await LeadRepository.update(id, data);
  }

  async delete(id: string) {
    return await LeadRepository.delete(id);
  }
}

export default new LeadService();
