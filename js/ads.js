const ads = {
  cooldown: false,
  remaining: 0,
  timer: null,

  async watchAd() {
    // 1. Если кулдаун активен — не даем нажать
    if (this.cooldown) {
      showToast(`⏳ Подождите ещё ${this.remaining} сек`);
      return;
    }

    // 2. Визуальный эффект нажатия
    const btn = document.getElementById('adBtn');
    btn.disabled = true;
    btn.textContent = '⏳...';

    // 3. ИМИТАЦИЯ (Вместо реальной рекламы)
    // Мы просто сразу даем награду через полсекунды (для красоты)
    setTimeout(() => {
        this.grantReward();
        this.startCooldown(60); // Ставим 60 секунд ожидания
        this.resetBtn();
    }, 500); 
  },

  // Функция выдачи награды
  grantReward() {
    state.data.coins += 50;
    state.save();
    showToast('🎉 +50 монет (Тест)');
    
    // Обновляем интерфейс игры (чтобы счетчик обновился)
    if (typeof game !== 'undefined' && game.renderGrid) {
        game.renderGrid();
    }
  },

  // Запуск таймера
  startCooldown(seconds) {
    this.cooldown = true;
    this.remaining = seconds;
    const btn = document.getElementById('adBtn');
    
    this.timer = setInterval(() => {
      this.remaining--;
      btn.textContent = `⏳ ${this.remaining}с`;
      
      if (this.remaining <= 0) {
        clearInterval(this.timer);
        this.cooldown = false;
        this.resetBtn();
      }
    }, 1000);
  },

  // Сброс кнопки
  resetBtn() {
    const btn = document.getElementById('adBtn');
    if (btn) {
        btn.disabled = false;
        btn.textContent = '📺 Реклама (+50)';
    }
  }
};
