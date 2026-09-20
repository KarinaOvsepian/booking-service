import { Book } from '../../models/Book';

export interface BookListEvents {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
}

export class BookList {
  private element: HTMLElement;
  private listContainer: HTMLElement;
  private paginationContainer: HTMLElement;
  private searchInput: HTMLInputElement;
  private events: BookListEvents;

  private books: Book[] = [];
  private searchQuery: string = '';
  private currentPage: number = 1;
  private readonly itemsPerPage: number = 5;

  constructor(events: BookListEvents) {
    this.events = events;
    this.element = document.createElement('div');
    this.element.className = 'card shadow-sm mb-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-4';

    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3 flex-wrap gap-2';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold mb-0';
    title.textContent = 'Список Книг';

    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.className = 'form-control w-auto';
    this.searchInput.placeholder = 'Пошук за назвою чи автором...';
    this.searchInput.addEventListener('input', () => {
      this.searchQuery = this.searchInput.value.toLowerCase();
      this.currentPage = 1;
      this.render();
    });

    header.append(title, this.searchInput);

    this.listContainer = document.createElement('div');
    this.listContainer.className = 'd-flex flex-column gap-2 mb-3';

    this.paginationContainer = document.createElement('div');
    this.paginationContainer.className = 'd-flex justify-content-center gap-1';

    cardBody.append(header, this.listContainer, this.paginationContainer);
    this.element.append(cardBody);
  }

  public update(books: Book[]): void {
    this.books = books;
    this.render();
  }

  private render(): void {
    this.listContainer.innerHTML = '';
    this.paginationContainer.innerHTML = '';

    const filtered = this.books.filter(
      (b) =>
        b.title.toLowerCase().includes(this.searchQuery) ||
        b.author.toLowerCase().includes(this.searchQuery)
    );

    if (filtered.length === 0) {
      this.listContainer.innerHTML = '<div class="text-muted py-2">Книг не знайдено.</div>';
      return;
    }

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    paginatedItems.forEach((book) => {
      const row = document.createElement('div');
      row.className =
        'd-flex justify-content-between align-items-center py-2 px-3 border rounded bg-light';

      const info = document.createElement('span');
      info.textContent = `${book.title} by ${book.author} (${book.year})`;

      const actions = document.createElement('div');
      actions.className = 'd-flex gap-2';

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = `btn btn-sm ${book.isBorrowed ? 'btn-warning text-dark' : 'btn-primary'}`;
      toggleBtn.textContent = book.isBorrowed ? 'Повернути' : 'Позичити';
      toggleBtn.addEventListener('click', () => {
        if (book.isBorrowed) {
          this.events.onReturn(book.id);
        } else {
          this.events.onBorrow(book.id);
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-sm btn-outline-danger';
      deleteBtn.textContent = '✕';
      deleteBtn.title = 'Видалити книгу';
      deleteBtn.addEventListener('click', () => {
        this.events.onDelete(book.id);
      });

      actions.append(toggleBtn, deleteBtn);
      row.append(info, actions);
      this.listContainer.append(row);
    });

    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `btn btn-sm ${i === this.currentPage ? 'btn-primary' : 'btn-outline-secondary'}`;
        pageBtn.textContent = i.toString();
        pageBtn.addEventListener('click', () => {
          this.currentPage = i;
          this.render();
        });
        this.paginationContainer.append(pageBtn);
      }
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
