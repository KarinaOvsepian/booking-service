import { User } from '../../models/User';

export interface UserListEvents {
  onDelete: (userId: string) => void;
}

export class UserList {
  private element: HTMLElement;
  private listContainer: HTMLElement;
  private paginationContainer: HTMLElement;
  private events: UserListEvents;

  private users: User[] = [];
  private currentPage: number = 1;
  private readonly itemsPerPage: number = 5;

  constructor(events: UserListEvents) {
    this.events = events;
    this.element = document.createElement('div');
    this.element.className = 'card shadow-sm mb-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-4';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold mb-3';
    title.textContent = 'Список Користувачів';

    this.listContainer = document.createElement('div');
    this.listContainer.className = 'd-flex flex-column gap-2 mb-3';

    this.paginationContainer = document.createElement('div');
    this.paginationContainer.className = 'd-flex justify-content-center gap-1';

    cardBody.append(title, this.listContainer, this.paginationContainer);
    this.element.append(cardBody);
  }

  public update(users: User[]): void {
    this.users = users;
    this.render();
  }

  private render(): void {
    this.listContainer.innerHTML = '';
    this.paginationContainer.innerHTML = '';

    if (this.users.length === 0) {
      this.listContainer.innerHTML = '<div class="text-muted py-2">Користувачів не додано.</div>';
      return;
    }

    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedItems = this.users.slice(startIndex, startIndex + this.itemsPerPage);

    paginatedItems.forEach((user) => {
      const row = document.createElement('div');
      row.className =
        'd-flex justify-content-between align-items-center py-2 px-3 border rounded bg-light';

      const info = document.createElement('span');
      info.textContent = `${user.id} ${user.name} (${user.email})`;

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-sm btn-outline-danger';
      deleteBtn.textContent = '✕';
      deleteBtn.title = 'Видалити користувача';
      deleteBtn.addEventListener('click', () => {
        this.events.onDelete(user.id);
      });

      row.append(info, deleteBtn);
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
