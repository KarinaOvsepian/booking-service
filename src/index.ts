import './styles/styles.scss';
import { BookForm } from './ui/components/BookForm';
import { BookList } from './ui/components/BookList';
import { UserForm } from './ui/components/UserForm';
import { UserList } from './ui/components/UserList';
import { LibraryService } from './services/LibraryService';
import { NotificationService } from './services/NotificationService';
import { Validation } from './utils/validators';

const app = document.getElementById('app');

if (app) {
  const libraryService = new LibraryService();

  const container = document.createElement('div');
  container.className = 'container py-4';
  container.style.maxWidth = '800px';

  const heading = document.createElement('h3');
  heading.className = 'text-center fw-bold mb-4';
  heading.textContent = 'Система Управління Бібліотекою';
  container.append(heading);

  const bookList = new BookList({
    onBorrow: async (bookId) => {
      const userId = await NotificationService.prompt(
        'Введіть ID користувача для позичення книги:'
      );
      if (!userId) {
        return;
      }

      if (!Validation.isNumericId(userId)) {
        await NotificationService.alert('ID користувача має складатись тільки з цифр!');
        return;
      }

      try {
        const { book, user } = libraryService.borrowBook(bookId, userId);
        bookList.update(libraryService.getBooks());
        await NotificationService.alert(
          `${book.title} by ${book.author} (${book.year}) has been borrowed by ${user.id} ${user.name} (${user.email}).`
        );
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Невідома помилка';
        await NotificationService.alert(errorMsg);
      }
    },
    onReturn: async (bookId) => {
      try {
        const returnedBook = libraryService.returnBook(bookId);
        bookList.update(libraryService.getBooks());
        await NotificationService.alert(
          `${returnedBook.title} by ${returnedBook.author} (${returnedBook.year}) has been returned.`,
          'Закрити'
        );
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Невідома помилка';
        await NotificationService.alert(errorMsg);
      }
    },
    onDelete: (bookId) => {
      libraryService.deleteBook(bookId);
      bookList.update(libraryService.getBooks());
    },
  });

  const userList = new UserList({
    onDelete: async (userId) => {
      try {
        libraryService.deleteUser(userId);
        userList.update(libraryService.getUsers());
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Невідома помилка';
        await NotificationService.alert(errorMsg);
      }
    },
  });

  const bookForm = new BookForm((book) => {
    libraryService.addBook(book);
    bookList.update(libraryService.getBooks());
  });

  const userForm = new UserForm((user) => {
    libraryService.addUser(user);
    userList.update(libraryService.getUsers());
  });

  container.append(
    bookForm.getElement(),
    userForm.getElement(),
    bookList.getElement(),
    userList.getElement()
  );

  app.append(container);

  bookList.update(libraryService.getBooks());
  userList.update(libraryService.getUsers());
}
