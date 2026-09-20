export class NotificationService {
  public static alert(message: string, buttonText: string = 'Зрозуміло!'): Promise<void> {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';

      const modal = document.createElement('div');
      modal.className = 'modal fade show d-block';
      modal.tabIndex = -1;
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-body p-4">
              <p class="fs-6 mb-4">${message}</p>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary px-4" id="modal-confirm-btn">${buttonText}</button>
              </div>
            </div>
          </div>
        </div>
      `;

      const closeHandler = (): void => {
        backdrop.remove();
        modal.remove();
        resolve();
      };

      const btn = modal.querySelector('#modal-confirm-btn');
      btn?.addEventListener('click', closeHandler);

      document.body.appendChild(backdrop);
      document.body.appendChild(modal);
    });
  }

  public static prompt(title: string, placeholder: string = 'ID'): Promise<string | null> {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';

      const modal = document.createElement('div');
      modal.className = 'modal fade show d-block';
      modal.tabIndex = -1;
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fs-6 fw-bold">${title}</h5>
              <button type="button" class="btn-close" id="modal-close-x"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <input type="text" class="form-control" id="modal-prompt-input" placeholder="${placeholder}" />
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary px-3" id="modal-cancel-btn">Скасувати</button>
                <button type="button" class="btn btn-primary px-3" id="modal-submit-btn">Зберегти</button>
              </div>
            </div>
          </div>
        </div>
      `;

      const input = modal.querySelector<HTMLInputElement>('#modal-prompt-input');

      const cleanup = (): void => {
        backdrop.remove();
        modal.remove();
      };

      modal.querySelector('#modal-close-x')?.addEventListener('click', () => {
        cleanup();
        resolve(null);
      });

      modal.querySelector('#modal-cancel-btn')?.addEventListener('click', () => {
        cleanup();
        resolve(null);
      });

      modal.querySelector('#modal-submit-btn')?.addEventListener('click', () => {
        const value = input?.value.trim() || '';
        cleanup();
        resolve(value || null);
      });

      document.body.appendChild(backdrop);
      document.body.appendChild(modal);
      input?.focus();
    });
  }
}
