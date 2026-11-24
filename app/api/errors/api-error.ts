import {
  DomainError,
  DuplicateResourceError,
  InvalidOperationError,
  ResourceNotFoundError,
  ValidationError,
} from "@/src/server/services/domain-errors";
import { AuthenticationRequiredError, AdminAuthorizationError } from "@/src/server/auth/errors";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function mapErrorToApiResponse(error: unknown): {
  status: number;
  body: { error: { code: string; message: string; details?: Record<string, unknown> } };
} {
  if (error instanceof AuthenticationRequiredError) {
    return {
      status: 401,
      body: { error: { code: "UNAUTHENTICATED", message: error.message } },
    };
  }

  if (error instanceof AdminAuthorizationError) {
    return {
      status: 403,
      body: { error: { code: "FORBIDDEN", message: error.message } },
    };
  }

  if (error instanceof DuplicateResourceError) {
    return {
      status: 409,
      body: { error: { code: "DUPLICATE_RESOURCE", message: error.message } },
    };
  }

  if (error instanceof InvalidOperationError) {
    return {
      status: 409,
      body: { error: { code: "INVALID_OPERATION", message: error.message } },
    };
  }

  if (error instanceof ResourceNotFoundError) {
    return {
      status: 404,
      body: { error: { code: "NOT_FOUND", message: error.message } },
    };
  }

  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: { error: { code: "VALIDATION_ERROR", message: error.message } },
    };
  }

  if (error instanceof ZodError) {
    const details: Record<string, string> = {};
    for (const err of (error as ZodError).issues) {
      details[err.path.join(".")] = err.message;
    }
    return {
      status: 400,
      body: { error: { code: "VALIDATION_ERROR", message: "Dados inválidos", details } },
    };
  }

  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: { error: { code: error.code, message: error.message, details: error.details } },
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: { error: { code: "INTERNAL_ERROR", message: "Erro interno do servidor" } },
    };
  }

  return {
    status: 500,
    body: { error: { code: "INTERNAL_ERROR", message: "Erro desconhecido" } },
  };
}
