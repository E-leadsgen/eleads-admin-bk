import axios from "axios";

const HUBSPOT_BASE_URL = "https://api.hubapi.com";

type HubSpotSearchFilter = {
  propertyName: string;
  operator: string;
  value?: string;
  values?: string[];
  highValue?: string | undefined;
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

type HubspotAppointment = {
  id: string;
  properties: {
    hs_appointment_start: string;
    hs_createdate: string;
    hs_lastmodifieddate: string;
    hs_object_id: string;
    hpg_contract_amount: string | null;
    hs_pipeline_stage: string | null;
  };
  createdAt: string;
  updatedAt: string;
  url: string;
};

type HubspotAppointmentSearchResponse = {
  total: number;
  results: HubspotAppointment[];
  paging?: { next?: { after: string } };
};

type AppointmentStatusResponse = {
  results: {
    label: string;
    id: string;
    stages: {
      label: string;
      id: string;
    }[];
  }[];
};

type HubspotContact = {
  id: string;
  properties: {
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    product: string | null;
    product_description: string | null;
    phone: string | null;
  };
};

type HubSpotContactSearchResponse = {
  total: number;
  results: HubspotContact[];
  paging?: { next?: { after: string } };
};

type HubSpotSearchResponse = {
  total: number;
  results: HubSpotObject[];
  paging?: { next?: { after: string } };
};

type AppointmentsQuery = {
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  limit: number;
  after?: string | undefined;
};

export type NormalizedAppointment = {
  id: string;
  revenue: string | null;
  startAt: string;
  createdAt: string;
  url: string;
  appointmentStatus: string | null;
};

export type NormalizedContact = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  product: string | null;
  productDescription: string | null;
  phone: string | null;
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
  async searchCompanyByEmail(email: string): Promise<HubSpotObject | null> {
    const body: HubSpotSearchRequest = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "company_email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
      properties: ["name", "domain", "company_email"],
      limit: 1,
    };

    const result = await hubspotFetch<HubSpotSearchResponse>(
      "/crm/objects/2026-03/companies/search",
      { method: "POST", body: JSON.stringify(body) },
    );

    return result.results[0] ?? null;
  }

  async getCompanyAppointments(
    companyId: string,
    filters?: AppointmentsQuery,
  ): Promise<{
    items: NormalizedAppointment[];
    paging?: { next?: { after: string } };
  } | null> {
    const body: HubSpotSearchRequest = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "associations.company",
              operator: "EQ",
              value: companyId,
            },
            ...(filters?.dateTo && filters?.dateFrom
              ? [
                  {
                    propertyName: "hs_appointment_start",
                    operator: "BETWEEN",
                    value: filters.dateFrom.toISOString(),
                    highValue: filters.dateTo.toISOString(),
                  },
                ]
              : []),
          ],
        },
      ],
      properties: [
        "hs_pipeline_stage",
        "hs_appointment_start",
        "hpg_contract_amount",
        "hs_createdate",
      ],
      limit: filters?.limit ?? 20,
      ...(filters?.after !== undefined && { after: filters.after }),
    };

    try {
      const response = await hubspotFetch<HubspotAppointmentSearchResponse>(
        "/crm/objects/2026-03/appointments/search",
        { method: "POST", body: JSON.stringify(body) },
      );

      const appointmentStatus = await hubspotFetch<AppointmentStatusResponse>(
        "/crm/v3/pipelines/appointments",
      );

      if (!response.results || !response.results.length) return null;
      if (appointmentStatus.results.length === 0) return null;

      const label = "B2C | Home Pro Guides";
      const b2cStages = appointmentStatus.results.find(
        (r) => r.label === label,
      )?.stages;

      return {
        items: response.results.map((appointment) => ({
          id: appointment.id,
          revenue: appointment.properties.hpg_contract_amount,
          startAt: appointment.properties.hs_appointment_start,
          createdAt: appointment.properties.hs_createdate,
          url: appointment.url,
          appointmentStatus:
            b2cStages?.find(
              (s) => s.id === appointment.properties.hs_pipeline_stage,
            )?.label ?? null,
        })),
        ...(response.paging !== undefined && { paging: response.paging }),
      };
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  }

  async searchContactsByAppointmentIds(
    appointmentIds: string[],
  ): Promise<NormalizedContact[]> {
    const body: HubSpotSearchRequest = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "associations.appointment",
              operator: "IN",
              values: appointmentIds,
            },
          ],
        },
      ],
      properties: [
        "firstname",
        "lastname",
        "email",
        "product",
        "product_description",
        "phone",
      ],
      limit: 100,
    };

    const response = await hubspotFetch<HubSpotContactSearchResponse>(
      "crm/objects/2026-03/contacts/search",
      { method: "POST", body: JSON.stringify(body) },
    );

    if (!response.results || !response.results.length) return [];

    return response.results.map((contact) => ({
      id: contact.id,
      firstname: contact.properties.firstname,
      lastname: contact.properties.lastname,
      email: contact.properties.email,
      product: contact.properties.product,
      productDescription: contact.properties.product_description,
      phone: contact.properties.phone,
    }));
  }
}

export default new HubspotRepository();
