export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ResourceNotFoundError extends DomainError {}
export class DuplicateResourceError extends DomainError {}
export class InvalidOperationError extends DomainError {}
export class ValidationError extends DomainError {}
