import { z } from "zod";
import { BUSINESS_DAYS } from "@/src/types/settings";

const brazilianDdd = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24",
  "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43",
  "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62",
  "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77",
  "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92",
  "93", "94", "95", "96", "97", "98", "99",
]);

export function normalizeBrazilianWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  const national = digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits;
  const ddd = national.slice(0, 2);
  const subscriber = national.slice(2);

  if (!brazilianDdd.has(ddd) || !/^[6-9]\d{8}$/.test(subscriber)) {
    throw new Error("Informe um número de WhatsApp brasileiro válido com DDD.");
  }

  return `55${national}`;
}

const time = z.string().regex(/^\d{2}:\d{2}$/, "Informe um horário válido.");

export const businessHourSchema = z.object({
  dayOfWeek: z.enum(BUSINESS_DAYS),
  isOpen: z.boolean(),
  openingTime: time.nullable(),
  closingTime: time.nullable(),
}).superRefine((value, context) => {
  if (!value.isOpen) return;
  if (!value.openingTime || !value.closingTime) {
    context.addIssue({ code: "custom", path: ["openingTime"], message: "Informe os horários do dia aberto." });
  } else if (value.openingTime >= value.closingTime) {
    context.addIssue({ code: "custom", path: ["closingTime"], message: "O encerramento deve ser posterior à abertura." });
  }
});

export const adminSettingsSchema = z.object({
  ownerName: z.string().trim().min(1, "Informe o nome da proprietária.").max(120),
  whatsapp: z.string().trim().min(1, "Informe o WhatsApp."),
  timezone: z.string().default("America/Fortaleza"),
  hours: z.array(businessHourSchema).length(7, "Informe os sete dias da semana."),
}).superRefine((value, context) => {
  const days = new Set(value.hours.map((hour) => hour.dayOfWeek));
  if (days.size !== 7 || BUSINESS_DAYS.some((day) => !days.has(day))) {
    context.addIssue({ code: "custom", path: ["hours"], message: "Informe cada dia da semana uma única vez." });
  }
  try {
    normalizeBrazilianWhatsapp(value.whatsapp);
  } catch (error) {
    context.addIssue({ code: "custom", path: ["whatsapp"], message: error instanceof Error ? error.message : "WhatsApp inválido." });
  }
});

export type AdminSettingsInput = z.infer<typeof adminSettingsSchema>;
