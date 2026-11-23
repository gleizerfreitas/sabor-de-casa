export function jsonResponse(data: unknown, status: number = 200): Response {
  return Response.json(data, { status });
}

export function successResponse(data: unknown, status: number = 200): Response {
  return jsonResponse({ data }, status);
}
