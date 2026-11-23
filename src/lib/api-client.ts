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
export async function apiGetCategories() {
  const response = await fetch("/api/categorias");
  return handleApiResponse(response);
}

export async function apiCreateCategory(name: string) {
  const response = await fetch("/api/categorias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handleApiResponse(response);
}

export async function apiUpdateCategory(id: string, name: string) {
  const response = await fetch(`/api/categorias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handleApiResponse(response);
}

export async function apiDeleteCategory(id: string) {
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
export async function apiGetDishes() {
  const response = await fetch("/api/pratos");
  return handleApiResponse(response);
}

export async function apiDeleteDish(id: string) {
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
export async function apiGetDailyMenus() {
  const response = await fetch("/api/cardapios");
  return handleApiResponse(response);
}

export async function apiGetTodayMenuSummary() {
  const response = await fetch("/api/cardapios/hoje-resumo");
  return handleApiResponse(response);
}

export async function apiGetTodayMenuAvailability(menuId: string) {
  const response = await fetch(`/api/cardapios/${menuId}/disponibilidade`);
  return handleApiResponse(response);
}

export async function apiSetMenuItemAvailability(menuId: string, dishId: string, available: boolean) {
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
export async function apiGetSettings() {
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
}) {
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
