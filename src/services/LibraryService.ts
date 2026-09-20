import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from './Library';
import { Storage } from './Storage';

const STORAGE_KEYS = {
  BOOKS: 'library_books',
  USERS: 'library_users',
};

export class LibraryService {
  private booksLib: Library<Book>;
  private usersLib: Library<User>;

  constructor() {
    const savedBooks = Storage.get<Book>(STORAGE_KEYS.BOOKS).map(
      (b) => new Book(b.id, b.title, b.author, b.year, b.isBorrowed, b.borrowedBy)
    );
    const savedUsers = Storage.get<User>(STORAGE_KEYS.USERS).map(
      (u) => new User(u.id, u.name, u.email, u.borrowedBooks || [])
    );

    this.booksLib = new Library<Book>(savedBooks);
    this.usersLib = new Library<User>(savedUsers);
  }

  private persist(): void {
    Storage.set(STORAGE_KEYS.BOOKS, this.booksLib.getAll());
    Storage.set(STORAGE_KEYS.USERS, this.usersLib.getAll());
  }

  public getBooks(): Book[] {
    return this.booksLib.getAll();
  }

  public addBook(book: Book): void {
    this.booksLib.add(book);
    this.persist();
  }

  public deleteBook(id: string): void {
    const book = this.booksLib.findById(id);
    if (book && book.isBorrowed && book.borrowedBy) {
      const user = this.usersLib.findById(book.borrowedBy);
      user?.returnBook(id);
    }
    this.booksLib.remove(id);
    this.persist();
  }

  public getUsers(): User[] {
    return this.usersLib.getAll();
  }

  public addUser(user: User): void {
    this.usersLib.add(user);
    this.persist();
  }

  public deleteUser(id: string): void {
    const user = this.usersLib.findById(id);
    if (user && user.borrowedBooks.length > 0) {
      throw new Error('Неможливо видалити користувача, який має неповернуті книги.');
    }
    this.usersLib.remove(id);
    this.persist();
  }

  public findUserById(id: string): User | undefined {
    return this.usersLib.findById(id);
  }

  public borrowBook(bookId: string, userId: string): { book: Book; user: User } {
    const book = this.booksLib.findById(bookId);
    if (!book) {
      throw new Error('Книгу не знайдено.');
    }
    if (book.isBorrowed) {
      throw new Error('Книга вже позичена іншим користувачем.');
    }

    const user = this.usersLib.findById(userId);
    if (!user) {
      throw new Error(`Користувача з ID ${userId} не знайдено в системі.`);
    }

    if (!user.canBorrow()) {
      throw new Error('Користувач уже позичив максимальну кількість книг (3 книги).');
    }

    book.markAsBorrowed(user.id);
    user.borrowBook(book.id);
    this.persist();

    return { book, user };
  }

  public returnBook(bookId: string): Book {
    const book = this.booksLib.findById(bookId);
    if (!book) {
      throw new Error('Книгу не знайдено.');
    }
    if (!book.isBorrowed) {
      throw new Error('Ця книга не була позичена.');
    }

    if (book.borrowedBy) {
      const user = this.usersLib.findById(book.borrowedBy);
      user?.returnBook(book.id);
    }

    book.markAsReturned();
    this.persist();

    return book;
  }
}
