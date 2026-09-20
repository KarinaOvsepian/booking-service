import './styles/styles.scss';

const app = document.getElementById('app');
if (app) {
  const title = document.createElement('h1');
  title.className = 'text-center my-4 text-primary';
  title.textContent = 'Система Управління Бібліотекою';
  app.appendChild(title);
}
