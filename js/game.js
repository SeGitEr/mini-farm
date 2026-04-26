const game = {
  selectedCrop: 'wheat',

  init() {
    this.renderShop();
    this.loop();
  },

  renderShop() {
    const list = document.getElementById('shop-list');
    list.innerHTML = '';
    for (const [key, val] of Object.entries(CONFIG.crops)) {
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <span>${key === 'wheat' ? '🌾' : key === 'carrot' ? '🥕' : '🍅'} ${key} (${val.time}с)</span>
        <button class="btn-vk primary" onclick="game.selectCrop('${key}', this)">${val.cost} 💰</button>
      `;
      list.appendChild(div);
    }
  },

  selectCrop(crop, btn) {
    this.selectedCrop = crop;
    document.getElementById('shopModal').style.display = 'none';
    showToast(`Выбрано: ${crop}`);
  },

  showShop() { document.getElementById('shopModal').style.display = 'flex'; },
  
  closeShop(e) { 
    if(!e.target.classList.contains('modal-card')) document.getElementById('shopModal').style.display = 'none'; 
  },

  handleCellClick(index) {
    const cell = state.data.cells[index];
    const cropConfig = CONFIG.crops[this.selectedCrop];

    if (!cell) {
      if (state.data.coins >= cropConfig.cost) {
        state.data.coins -= cropConfig.cost;
        state.data.cells[index] = { type: this.selectedCrop, plantedAt: Date.now() };
        state.save();
        this.renderGrid();
      } else { showToast('❌ Нет монет'); }
    } else {
      const elapsed = (Date.now() - cell.plantedAt) / 1000;
      if (elapsed >= cropConfig.time) {
        state.data.coins += cropConfig.sell;
        state.data.cells[index] = null;
        state.save();
        this.renderGrid();
        showToast(`💰 +${cropConfig.sell}`);
      } else { showToast(`⏳ Жди ${Math.ceil(cropConfig.time - elapsed)}с`); }
    }
  },

  renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    document.getElementById('coinCount').textContent = state.data.coins;

    state.data.cells.forEach((cell, i) => {
      const div = document.createElement('div');
      div.className = 'cell';
      if (!cell) div.classList.add('empty');
      
      div.onclick = () => {
        if(navigator.vibrate) navigator.vibrate(10);
        this.handleCellClick(i);
      };

      if (cell) {
        const elapsed = Math.floor((Date.now() - cell.plantedAt) / 1000);
        const progress = Math.min(elapsed / CONFIG.crops[cell.type].time, 1);
        const stage = Math.min(Math.floor(progress * 2.99), 2);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'plant-wrapper';
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 32 32");
        svg.classList.add('plant-svg');
        if (progress >= 1) svg.classList.add('grown');
        svg.innerHTML = CONFIG.svg[cell.type].stages[stage];
        
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        const fill = document.createElement('div');
        fill.className = 'progress-fill';
        fill.style.width = (progress * 100) + '%';
        bar.appendChild(fill);

        wrapper.appendChild(svg);
        div.appendChild(wrapper);
        div.appendChild(bar);
      }
      grid.appendChild(div);
    });
  },

  loop() {
    this.renderGrid();
    setTimeout(() => this.loop(), 500);
  }
};