import axios from "axios";

const HUBSPOT_BASE_URL = "https://api.hubapi.com/crm/v3/objects";

type HubSpotSearchFilter = {
  propertyName: string;
  operator: string;
  value: string;
};

type HubSpotSearchRequest = {
  filterGroups: { filters: HubSpotSearchFilter[] }[];
  properties?: string[];
  limit?: number;
  after?: string;
};

type HubSpotObject = {
  id: string;
  properties: Record<string, string | null>;
  createdAt: string;
  updatedAt: string;
};

type HubSpotSearchResponse = {
  total: number;
  results: HubSpotObject[];
  paging?: { next?: { after: string } };
};

function getAccessToken(): string {
  const token = process.env.HUBSPOT_API_KEY;
  if (!token) {
    throw new Error("HUBSPOT_API_KEY is not configured");
  }
  return token;
}

const hubspotClient = axios.create({
  baseURL: HUBSPOT_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

hubspotClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});

async function hubspotFetch<T>(
  path: string,
  options: { method?: string; body?: string } = {},
): Promise<T> {
  const { data } = await hubspotClient.request<T>({
    url: path,
    method: (options.method as any) ?? "GET",
    data: options.body ? JSON.parse(options.body) : undefined,
  });

  return data;
}

class HubspotRepository {
  async searchCompanyByDomain(domain: string): Promise<HubSpotObject | null> {
    const body: HubSpotSearchRequest = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "domain",
              operator: "EQ",
              value: domain,
            },
          ],
        },
      ],
      properties: [
        "name",
        "domain",
        "industry",
        "phone",
        "city",
        "state",
        "country",
        "website",
        "description",
        "numberofemployees",
        "annualrevenue",
        "createdate",
        "hs_lastmodifieddate",
      ],
      limit: 1,
    };

    const result = await hubspotFetch<HubSpotSearchResponse>(
      "/companies/search",
      { method: "POST", body: JSON.stringify(body) },
    );

    return result.results[0] ?? null;
  }

  async searchContactsByCompany(
    companyId: string,
    options: {
      name?: string;
      email?: string;
      dateFrom?: Date;
      dateTo?: Date;
      limit?: number;
      after?: string;
    } = {},
  ): Promise<HubSpotSearchResponse> {
    const filters: HubSpotSearchFilter[] = [
      {
        propertyName: "associations.company",
        operator: "EQ",
        value: companyId,
      },
    ];

    if (options.name) {
      filters.push({
        propertyName: "firstname",
        operator: "CONTAINS_TOKEN",
        value: `*${options.name}*`,
      });
    }

    // if (options.email) {
    //   filters.push({
    //     propertyName: "email",
    //     operator: "CONTAINS_TOKEN",
    //     value: `*${options.email}*`,
    //   });
    // }

    if (options.dateFrom) {
      filters.push({
        propertyName: "createdate",
        operator: "GTE",
        value: options.dateFrom.getTime().toString(),
      });
    }

    if (options.dateTo) {
      filters.push({
        propertyName: "createdate",
        operator: "LTE",
        value: options.dateTo.getTime().toString(),
      });
    }

    const body: HubSpotSearchRequest = {
      filterGroups: [{ filters }],
      properties: [
        "firstname",
        "lastname",
        "hs_lead_status",
        "email",
        "phone",
        "mobilephone",
        "company",
        "jobtitle",
        "hs_lead_status",
        "address",
        "city",
        "state",
        "zip",
        "country",
        "website",
        "industry",
        "annualrevenue",
        "createdate",
        "lastmodifieddate",
        "hs_object_id",
        "product",
        "product_description",
      ],
      limit: options.limit ?? 10,
      ...(options.after ? { after: options.after } : {}),
    };

    return await hubspotFetch<HubSpotSearchResponse>("/contacts/search", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

export default new HubspotRepository();
