const state = {
  data: { coins: 100, cells: Array(25).fill(null) },
  
  load() {
    try {
      const saved = localStorage.getItem('miniFarmState');
      if (saved) this.data = JSON.parse(saved);
    } catch (e) { console.error('Load error', e); }
  },
  
  save() {
    localStorage.setItem('miniFarmState', JSON.stringify(this.data));
  },
  
  resetGame() {
    if(confirm('Сбросить прогресс?')) {
      localStorage.removeItem('miniFarmState');
      this.data = { coins: 100, cells: Array(25).fill(null) };
      location.reload();
    }
  }
};