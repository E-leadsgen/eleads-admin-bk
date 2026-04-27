// ── Hubspot domain types ─────────────────────────────────────

export type AppointmentStatus =
  | "Sale"
  | "Completed"
  | "Canceled"
  | "Still Working";

export type AppointmentContact = {
  idContact: string;
  idAppointment: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  status: AppointmentStatus | null;
  revenue: string | null;
  product: string | null;
  productDescription: string | null;
  phone: string | null;
  startAt: string;
};

export type PeriodMetrics = {
  totalLeads: number;
  closingRate: number;
  totalRevenue: number;
};

export type PaginatedAppointments = {
  items: AppointmentContact[];
  paging?: { next?: { after: string } };
};
