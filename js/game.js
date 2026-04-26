const game = {
  selectedCrop: 'wheat',

  init() {
    this.renderShop();
    this.loop();
  },

  renderShop() {
    const list = document.getElementById('shop-list');
    if (!list) return;
    
    list.innerHTML = '';
    for (const [key, val] of Object.entries(CONFIG.crops)) {
      const div = document.createElement('div');
      div.className = 'shop-item';
      
      const emoji = key === 'wheat' ? '🌾' : key === 'carrot' ? '🥕' : '🍅';
      
      div.innerHTML = `
        <span>${emoji} ${key} (${val.time} сек)</span>
        <button class="btn-vk primary" onclick="game.selectCrop('${key}', this)">${val.cost} 💰</button>
      `;
      list.appendChild(div);
    }
  },

  selectCrop(crop, btn) {
    this.selectedCrop = crop;
    document.getElementById('shopModal').style.display = 'none';
    
    const emoji = crop === 'wheat' ? '🌾' : crop === 'carrot' ? '🥕' : '🍅';
    showToast(`${emoji} Выбрано: ${crop}`);
  },

  showShop() { 
    document.getElementById('shopModal').style.display = 'flex'; 
  },
  
  closeShop(e) { 
    if (!e.target.classList.contains('modal-card')) {
      document.getElementById('shopModal').style.display = 'none'; 
    }
  },

  handleCellClick(index) {
    const cell = state.data.cells[index];
    const cropConfig = CONFIG.crops[this.selectedCrop];

    if (!cell) {
      // Посадка растения
      if (state.data.coins >= cropConfig.cost) {
        state.data.coins -= cropConfig.cost;
        state.data.cells[index] = { 
          type: this.selectedCrop, 
          plantedAt: Date.now() 
        };
        state.save();
        this.renderGrid();
      } else { 
        showToast('❌ Недостаточно монет!'); 
      }
    } else {
      // Сбор урожая
      const cropTime = CONFIG.crops[cell.type].time;
      const elapsed = (Date.now() - cell.plantedAt) / 1000;
      
      if (elapsed >= cropTime) {
        const sellPrice = CONFIG.crops[cell.type].sell;
        state.data.coins += sellPrice;
        state.data.cells[index] = null;
        state.save();
        this.renderGrid();
        showToast(`💰 +${sellPrice} монет!`);
      } else { 
        const remaining = Math.ceil(cropTime - elapsed);
        showToast(`⏳ Ещё ${remaining} сек`); 
      }
    }
  },

  renderGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Обновляем счётчик монет
    const coinCount = document.getElementById('coinCount');
    if (coinCount) {
      coinCount.textContent = state.data.coins;
    }

    state.data.cells.forEach((cell, i) => {
      const div = document.createElement('div');
      div.className = 'cell';
      
      if (!cell) {
        div.classList.add('empty');
      } else {
        // Растение посажено
        const cropConfig = CONFIG.crops[cell.type];
        if (!cropConfig) {
          console.error('Неизвестная культура:', cell.type);
          div.textContent = '❓';
          grid.appendChild(div);
          return;
        }
        
        const elapsed = Math.floor((Date.now() - cell.plantedAt) / 1000);
        const progress = Math.min(elapsed / cropConfig.time, 1);
        const stageIndex = Math.min(Math.floor(progress * 2.99), 2); // 0, 1, или 2
        
        // Создаём обёртку для растения
        const wrapper = document.createElement('div');
        wrapper.className = 'plant-wrapper';
        
        // Создаём SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 32 32");
        svg.classList.add('plant-svg');
        
        if (progress >= 1) {
          svg.classList.add('grown');
        }
        
        // БЕЗОПАСНОЕ получение SVG графики
        const plantData = CONFIG.svg[cell.type];
        if (plantData && plantData.stages && plantData.stages[stageIndex]) {
          svg.innerHTML = plantData.stages[stageIndex];
        } else {
          // Заглушка, если графика не найдена
          console.warn(`Нет SVG для ${cell.type}, стадия ${stageIndex}`);
          svg.innerHTML = `<circle cx="16" cy="16" r="10" fill="#FF5722"/>`;
        }
        
        // Создаём полосу прогресса
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
      
      // Добавляем обработчик клика
      div.onclick = () => {
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
        this.handleCellClick(i);
      };
      
      grid.appendChild(div);
    });
  },

  loop() {
    this.renderGrid();
    setTimeout(() => this.loop(), 500);
  }
};