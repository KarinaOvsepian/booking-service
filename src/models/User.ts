import { IUser } from './interfaces/IUser';

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public borrowedBooks: string[] = []
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public canBorrow(): boolean {
    return this.borrowedBooks.length < 3;
  }

  public borrowBook(bookId: string): void {
    if (!this.canBorrow()) {
      throw new Error('Користувач не може позичити більше 3-х книг.');
    }
    this.borrowedBooks.push(bookId);
  }

  public returnBook(bookId: string): void {
    this.borrowedBooks = this.borrowedBooks.filter((id) => id !== bookId);
  }
}
