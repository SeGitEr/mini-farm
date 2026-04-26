const ads = {
  cooldown: false,
  remaining: 0,
  timer: null,

  async watchAd() {
    if (!window.vkBridge) { showToast('📱 Только в ВК'); return; }
    if (this.cooldown) { showToast(`⏳ Жди ${this.remaining}с`); return; }

    const btn = document.getElementById('adBtn');
    btn.disabled = true;
    btn.textContent = '⏳...';

    try {
      const res = await vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' });
      if (res.result) {
        state.data.coins += 50;
        state.save();
        showToast('🎉 +50 монет');
        this.startCooldown(60);
      } else { this.resetBtn(); }
    } catch (e) { 
      console.error(e); 
      this.resetBtn(); 
      showToast('⚠️ Ошибка'); 
    }
  },

  startCooldown(sec) {
    this.cooldown = true;
    this.remaining = sec;
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

  resetBtn() {
    const btn = document.getElementById('adBtn');
    btn.disabled = false;
    btn.textContent = '📺 Реклама (+50)';
  }
};