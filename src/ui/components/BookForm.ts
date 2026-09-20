import { Book } from '../../models/Book';
import { generateNumericId } from '../../utils/idGenerator';
import { Validation } from '../../utils/validators';

export class BookForm {
  private element: HTMLElement;
  private onBookCreated: (book: Book) => void;

  constructor(onBookCreated: (book: Book) => void) {
    this.onBookCreated = onBookCreated;
    this.element = this.createView();
  }

  private createView(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card shadow-sm mb-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-4';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold mb-3';
    title.textContent = 'Додати Книгу';

    const form = document.createElement('form');
    form.noValidate = true;

    const {
      container: titleGroup,
      input: titleInput,
      errorEl: titleError,
    } = this.createInputGroup('Назва книги', 'text');
    const {
      container: authorGroup,
      input: authorInput,
      errorEl: authorError,
    } = this.createInputGroup('Автор', 'text');
    const {
      container: yearGroup,
      input: yearInput,
      errorEl: yearError,
    } = this.createInputGroup('Рік видання', 'text');

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-success px-3';
    submitBtn.textContent = 'Додати Книгу';

    form.append(titleGroup, authorGroup, yearGroup, submitBtn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      titleError.textContent = '';
      authorError.textContent = '';
      yearError.textContent = '';

      const bookTitle = titleInput.value.trim();
      const author = authorInput.value.trim();
      const yearStr = yearInput.value.trim();

      if (!Validation.isNotEmpty(bookTitle)) {
        titleError.textContent = "Це поле є обов'язковим";
        isValid = false;
      }

      if (!Validation.isNotEmpty(author)) {
        authorError.textContent = "Це поле є обов'язковим";
        isValid = false;
      }

      if (!Validation.isNotEmpty(yearStr)) {
        yearError.textContent = "Це поле є обов'язковим";
        isValid = false;
      } else if (!Validation.isValidYear(yearStr)) {
        yearError.textContent = 'Рік має складатись із 4 цифр та не перевищувати поточний рік';
        isValid = false;
      }

      if (isValid) {
        const newBook = new Book(
          generateNumericId(),
          bookTitle,
          author,
          parseInt(yearStr, 10),
          false
        );
        this.onBookCreated(newBook);
        form.reset();
      }
    });

    cardBody.append(title, form);
    card.append(cardBody);
    return card;
  }

  private createInputGroup(
    placeholder: string,
    type: string
  ): { container: HTMLElement; input: HTMLInputElement; errorEl: HTMLElement } {
    const container = document.createElement('div');
    container.className = 'mb-3';

    const input = document.createElement('input');
    input.type = type;
    input.className = 'form-control';
    input.placeholder = placeholder;

    const errorEl = document.createElement('div');
    errorEl.className = 'text-danger small mt-1';

    container.append(input, errorEl);
    return { container, input, errorEl };
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
