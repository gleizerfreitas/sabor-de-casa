export class AuthenticationRequiredError extends Error {
  constructor() {
    super("A sessão autenticada é necessária.");
    this.name = "AuthenticationRequiredError";
  }
}

export class AdminAuthorizationError extends Error {
  constructor() {
    super("O usuário autenticado não tem autorização administrativa.");
    this.name = "AdminAuthorizationError";
  }
}
