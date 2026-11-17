import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da categoria.").max(100),
});

const postgresUuid = z
  .string()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    "Selecione uma categoria válida.",
  );

export const dishSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do prato.").max(160),
  description: z.string().trim().max(1000).default(""),
  price: z.coerce.number().finite().positive("O preço deve ser maior que zero."),
  categoryId: postgresUuid,
  isActive: z.boolean().default(true),
});

export type DishInput = z.infer<typeof dishSchema>;
