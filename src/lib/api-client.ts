import type { Category, Dish } from "@/src/types/catalog";
import type { DailyMenu } from "@/src/types/menu";
import type { AdminSettings, TodayMenuSummary, TodayMenuAvailability, MenusListing, PublicMenu } from "@/src/lib/api-types";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const json = await response.json();

  if (!response.ok) {
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }

  return json.data;
}

// Categorias
export async function apiGetCategories(): Promise<Category[]> {
  const response = await fetch("/api/categorias");
  return handleApiResponse(response);
}

export async function apiCreateCategory(name: string): Promise<Category> {
  const response = await fetch("/api/categorias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handleApiResponse(response);
}

export async function apiUpdateCategory(id: string, name: string): Promise<Category> {
  const response = await fetch(`/api/categorias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handleApiResponse(response);
}

export async function apiDeleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/categorias/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }
}

// Pratos
export async function apiGetDishes(): Promise<Dish[]> {
  const response = await fetch("/api/pratos");
  return handleApiResponse(response);
}

export async function apiDeleteDish(id: string): Promise<void> {
  const response = await fetch(`/api/pratos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }
}

// Cardápios
export async function apiGetDailyMenus(): Promise<MenusListing> {
  const response = await fetch("/api/cardapios");
  return handleApiResponse(response);
}

export async function apiGetTodayMenuSummary(): Promise<TodayMenuSummary> {
  const response = await fetch("/api/cardapios/hoje-resumo");
  return handleApiResponse(response);
}

export async function apiGetTodayMenuAvailability(menuId: string): Promise<TodayMenuAvailability> {
  const response = await fetch(`/api/cardapios/${menuId}/disponibilidade`);
  return handleApiResponse(response);
}

export async function apiSetMenuItemAvailability(menuId: string, dishId: string, available: boolean): Promise<void> {
  const response = await fetch(`/api/cardapios/${menuId}/disponibilidade/items`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dishId, available }),
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }
}

// Configurações
export async function apiGetSettings(): Promise<AdminSettings> {
  const response = await fetch("/api/configuracoes");
  return handleApiResponse(response);
}

export async function apiUpdateSettings(input: {
  ownerName: string;
  whatsapp: string;
  timezone: string;
  businessHours: Array<{
    day_of_week: string;
    is_open: boolean;
    opening_time: string | null;
    closing_time: string | null;
  }>;
}): Promise<void> {
  const response = await fetch("/api/configuracoes", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }
}

// Cardápios
export async function apiGetDailyMenu(id: string): Promise<DailyMenu> {
  const response = await fetch(`/api/cardapios/${id}`);
  return handleApiResponse(response);
}

export async function apiDeleteDailyMenu(id: string): Promise<void> {
  const response = await fetch(`/api/cardapios/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }
}

// Pratos (FormData)
export async function apiCreateDish(formData: FormData): Promise<Dish> {
  const response = await fetch("/api/pratos", {
    method: "POST",
    body: formData,
  });
  return handleApiResponse(response);
}

export async function apiUpdateDish(id: string, formData: FormData): Promise<Dish> {
  const response = await fetch(`/api/pratos/${id}`, {
    method: "PUT",
    body: formData,
  });
  return handleApiResponse(response);
}

// Menu Operations
export async function apiCreateDailyMenu(menuDate: string, dishIds: string[]): Promise<DailyMenu> {
  const response = await fetch("/api/cardapios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: menuDate, dishIds }),
  });
  return handleApiResponse(response);
}

export async function apiUpdateDailyMenu(id: string, menuDate: string, dishIds: string[]): Promise<DailyMenu> {
  const response = await fetch(`/api/cardapios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: menuDate, dishIds }),
  });
  return handleApiResponse(response);
}

export async function apiPublishDailyMenu(id: string): Promise<void> {
  const response = await fetch(`/api/cardapios/${id}/publicar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }
}

export async function apiRemovePastMenus(): Promise<{ deletedCount: number }> {
  const response = await fetch("/api/cardapios/passados", {
    method: "DELETE",
  });

  if (!response.ok) {
    const json = await response.json();
    const error = json.error || {};
    throw new ApiError(response.status, error.code || "UNKNOWN_ERROR", error.message || "Erro desconhecido");
  }

  return handleApiResponse(response);
}

// Público
export async function apiGetPublicMenu(): Promise<PublicMenu> {
  const response = await fetch("/api/publica/cardapio");
  return handleApiResponse(response);
}
