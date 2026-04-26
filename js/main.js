// Утилиты
function showToast(msg) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
  if(window.vkBridge) vkBridge.send('VKWebAppInit');
  state.load();
  game.init();
});