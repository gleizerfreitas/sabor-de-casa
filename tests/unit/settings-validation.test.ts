import { describe, expect, it } from "vitest";
import {
  adminSettingsSchema,
  normalizeBrazilianWhatsapp,
} from "@/src/validations/settings";

const hours = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
].map((day, index) => ({
  dayOfWeek: day,
  isOpen: index < 5,
  openingTime: index < 5 ? "11:00" : null,
  closingTime: index < 5 ? "14:00" : null,
}));

describe("validação das configurações", () => {
  it("normaliza um WhatsApp brasileiro com máscara", () => {
    expect(normalizeBrazilianWhatsapp("(85) 99999-0000")).toBe("5585999990000");
    expect(normalizeBrazilianWhatsapp("5585999990000")).toBe("5585999990000");
  });

  it("rejeita números que não são brasileiros ou não têm celular válido", () => {
    expect(() => normalizeBrazilianWhatsapp("1212345678")).toThrow();
    expect(() => normalizeBrazilianWhatsapp("(85) 59999-0000")).toThrow();
  });

  it("exige horário completo e válido para dias abertos", () => {
    expect(() => adminSettingsSchema.parse({
      ownerName: "Maria",
      whatsapp: "(85) 99999-0000",
      hours: hours.map((hour, index) => index === 0
        ? { ...hour, openingTime: "14:00", closingTime: "11:00" }
        : hour),
    })).toThrow();
  });

  it("aceita os sete dias e ignora horários de dias fechados", () => {
    const result = adminSettingsSchema.parse({
      ownerName: "Maria",
      whatsapp: "(85) 99999-0000",
      hours,
    });
    expect(result.hours).toHaveLength(7);
  });
});
