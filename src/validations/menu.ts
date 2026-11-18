import { z } from "zod";

const postgresUuid = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    "Selecione pratos válidos.",
  );

export const dailyMenuSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida."),
  dishIds: z.array(postgresUuid).min(1, "Selecione pelo menos um prato."),
});

export type DailyMenuInput = z.infer<typeof dailyMenuSchema>;
