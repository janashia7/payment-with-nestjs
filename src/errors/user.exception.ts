import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(username: string) {
    super(`User with username ${username} not found.`, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends ConflictException {
  constructor(username: string) {
    super(`User with username ${username} already exists`);
  }
}

export class DatabaseException extends HttpException {
  constructor(message: string, error?: string) {
    super(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: message,
        message: `Database error: ${error}`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
