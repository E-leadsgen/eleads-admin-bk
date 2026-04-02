import type { CompanyContactsQuery } from "./hubspot.validation";
import HubspotRepository from "./hubspot.repository";

class HubspotService {
  private extractDomain(email: string): string {
    const domain = email.split("@")[1];
    if (!domain) {
      throw new Error("Invalid email format");
    }
    return domain.toLowerCase();
  }

  async findCompanyByEmail(email: string) {
    const domain = this.extractDomain(email);
    const company = await HubspotRepository.searchCompanyByDomain(domain);

    if (!company) return null;

    return {
      id: company.id,
      properties: company.properties,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  async findCompanyContacts(companyId: string, query: CompanyContactsQuery) {
    const { name, email, dateFrom, dateTo, limit, after } = query;

    const result = await HubspotRepository.searchContactsByCompany(companyId, {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
      limit,
      ...(after ? { after } : {}),
    });

    return {
      total: result.total,
      contacts: result.results.map((c) => ({
        id: c.id,
        properties: c.properties,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      paging: result.paging,
    };
  }
}

export default new HubspotService();
