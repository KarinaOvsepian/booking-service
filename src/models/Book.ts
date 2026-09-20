import { IBook } from './interfaces/IBook';

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed: boolean = false,
    public borrowedBy?: string
  ) {}

  public getTitle(): string {
    return this.title;
  }

  public getAuthor(): string {
    return this.author;
  }

  public getYear(): number {
    return this.year;
  }

  public markAsBorrowed(userId: string): void {
    this.isBorrowed = true;
    this.borrowedBy = userId;
  }

  public markAsReturned(): void {
    this.isBorrowed = false;
    this.borrowedBy = undefined;
  }
}
