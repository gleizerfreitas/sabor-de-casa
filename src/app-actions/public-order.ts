"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getPublicMenu } from "@/src/server/services/public-menu-service";
import { normalizeBrazilianWhatsapp } from "@/src/validations/settings";

const orderSchema = z.object({
  items: z.array(z.object({
    dishId: z.string().trim().regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "Identificador de prato inválido.",
    ),
    quantity: z.number().int().positive(),
  })).min(1, "Selecione pelo menos um prato."),
});

export type CreateWhatsAppLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createWhatsAppLink(input: z.infer<typeof orderSchema>): Promise<CreateWhatsAppLinkResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Pedido inválido." };
  }

  try {
    const menu = await getPublicMenu(await createSupabaseServerClient());
    if (!menu.isOpen) {
      return { ok: false, error: "O estabelecimento está fechado para novos pedidos." };
    }
    if (!menu.whatsapp) {
      return { ok: false, error: "O WhatsApp comercial ainda não foi configurado." };
    }

    const availableDishes = menu.categories.flatMap((category) => category.dishes);
    const selectedIds = new Set(parsed.data.items.map((item) => item.dishId));
    if (selectedIds.size !== parsed.data.items.length) {
      return { ok: false, error: "A seleção contém um prato repetido." };
    }

    const unavailable: string[] = [];
    const unavailableOrMissing: string[] = [];
    let total = 0;
    const lines: string[] = [];

    parsed.data.items.forEach((item) => {
      const dish = availableDishes.find((candidate) => candidate.id === item.dishId);
      if (!dish) {
        unavailableOrMissing.push(item.dishId);
        return;
      }
      if (!dish.available) {
        unavailable.push(dish.name);
        return;
      }
      const subtotal = dish.price * item.quantity;
      total += subtotal;
      lines.push(`• ${dish.name} — ${item.quantity} x ${formatPrice(dish.price)} = ${formatPrice(subtotal)}`);
    });

    if (unavailable.length > 0) {
      return { ok: false, error: `Pratos indisponíveis: ${unavailable.join(", ")}.` };
    }
    if (unavailableOrMissing.length > 0) {
      return { ok: false, error: "Um ou mais pratos não fazem mais parte do cardápio publicado." };
    }

    const whatsapp = normalizeBrazilianWhatsapp(menu.whatsapp);
    const message = [
      "Olá! Gostaria de fazer uma solicitação de pedido:",
      "",
      `Data: ${menu.dateLabel}`,
      ...lines,
      "",
      `Total estimado: ${formatPrice(total)}`,
      "",
      "A confirmação final depende da resposta da proprietária.",
    ].join("\n");

    return {
      ok: true,
      url: `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Não foi possível preparar o pedido.",
    };
  }
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
