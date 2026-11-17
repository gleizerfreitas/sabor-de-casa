import type { SupabaseClient } from "@supabase/supabase-js";
import { BUSINESS_DAYS, type AdminSettings, type BusinessHour } from "@/src/types/settings";

const defaultHours: BusinessHour[] = BUSINESS_DAYS.map((day, index) => ({
  day_of_week: day,
  is_open: index < 5,
  opening_time: index < 5 ? "11:00" : null,
  closing_time: index < 5 ? "14:00" : null,
}));

export function defaultAdminSettings(): AdminSettings {
  return {
    id: "",
    owner_name: "",
    whatsapp: "",
    timezone: "America/Fortaleza",
    business_hours: defaultHours.map((hour) => ({ ...hour })),
  };
}

export async function getAdminSettings(supabase: SupabaseClient) {
  const settingsResult = await supabase
    .from("admin_settings")
    .select("id, owner_name, whatsapp, timezone")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (settingsResult.error) throw new Error(`Não foi possível carregar as configurações: ${settingsResult.error.message}`);
  if (!settingsResult.data) return defaultAdminSettings();

  const hoursResult = await supabase
    .from("admin_business_hours")
    .select("id, day_of_week, is_open, opening_time, closing_time")
    .eq("settings_id", settingsResult.data.id)
    .order("day_of_week");

  if (hoursResult.error) throw new Error(`Não foi possível carregar os horários: ${hoursResult.error.message}`);

  const hoursByDay = new Map((hoursResult.data ?? []).map((hour) => [hour.day_of_week, hour]));
  return {
    ...settingsResult.data,
    business_hours: BUSINESS_DAYS.map((day) => {
      const hour = hoursByDay.get(day);
      return hour
        ? { ...hour, opening_time: hour.opening_time?.slice(0, 5) ?? null, closing_time: hour.closing_time?.slice(0, 5) ?? null }
        : defaultHours.find((defaultHour) => defaultHour.day_of_week === day)!;
    }),
  } as AdminSettings;
}

export async function updateAdminSettings(
  supabase: SupabaseClient,
  input: {
    ownerName: string;
    whatsapp: string;
    timezone: string;
    hours: Array<{ dayOfWeek: string; isOpen: boolean; openingTime: string | null; closingTime: string | null }>;
  },
) {
  const result = await supabase.rpc("update_admin_settings", {
    p_owner_name: input.ownerName,
    p_whatsapp: input.whatsapp,
    p_timezone: input.timezone,
    p_hours: input.hours,
  });
  if (result.error) throw new Error(`Não foi possível salvar as configurações: ${result.error.message}`);
}
