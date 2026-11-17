export const BUSINESS_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type BusinessDay = (typeof BUSINESS_DAYS)[number];

export type BusinessHour = {
  id?: string;
  day_of_week: BusinessDay;
  is_open: boolean;
  opening_time: string | null;
  closing_time: string | null;
};

export type AdminSettings = {
  id: string;
  owner_name: string;
  whatsapp: string;
  timezone: string;
  business_hours: BusinessHour[];
};
