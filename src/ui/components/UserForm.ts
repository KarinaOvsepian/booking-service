import { User } from '../../models/User';
import { generateNumericId } from '../../utils/idGenerator';
import { Validation } from '../../utils/validators';

export class UserForm {
  private element: HTMLElement;
  private onUserCreated: (user: User) => void;

  constructor(onUserCreated: (user: User) => void) {
    this.onUserCreated = onUserCreated;
    this.element = this.createView();
  }

  private createView(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card shadow-sm mb-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-4';

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold mb-3';
    title.textContent = 'Додати Користувача';

    const form = document.createElement('form');
    form.noValidate = true;

    const {
      container: nameGroup,
      input: nameInput,
      errorEl: nameError,
    } = this.createInputGroup("Ім'я", 'text');
    const {
      container: emailGroup,
      input: emailInput,
      errorEl: emailError,
    } = this.createInputGroup('Email', 'email');

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-success px-3';
    submitBtn.textContent = 'Додати Користувача';

    form.append(nameGroup, emailGroup, submitBtn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      nameError.textContent = '';
      emailError.textContent = '';

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (!Validation.isNotEmpty(name)) {
        nameError.textContent = "Це поле є обов'язковим";
        isValid = false;
      }

      if (!Validation.isNotEmpty(email)) {
        emailError.textContent = "Це поле є обов'язковим";
        isValid = false;
      } else if (!Validation.isValidEmail(email)) {
        emailError.textContent = 'Введіть коректну адресу електронної пошти';
        isValid = false;
      }

      if (isValid) {
        const newUser = new User(generateNumericId(), name, email, []);
        this.onUserCreated(newUser);
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
