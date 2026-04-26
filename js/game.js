const game = {
  selectedCrop: 'wheat',
  selectedBuild: null,
  mode: 'plant', // 'plant', 'build', 'select'
  unlockedCells: 25,
  selectedCells: [],

  init() {
    console.log('Game initialized');
    this.renderShop();
    this.loop();
    this.updateLandButton();
    this.updateModeButtons();
  },

  setMode(mode) {
    console.log('Switching to mode:', mode);
    this.mode = mode;
    this.selectedCells = [];
    
    const messages = {
      'plant': '🌱 Режим посадки',
      'build': '🔨 Режим стройки',
      'select': '📋 Выбери грядки (клик)'
    };
    
    showToast(messages[mode]);
    this.updateModeButtons();
    this.renderGrid();
  },

  harvestAll() {
    console.log('Harvest all clicked');
    let harvested = 0;
    let totalEarnings = 0;
    
    state.data.cells.forEach((cell, index) => {
      if (cell && cell.type !== 'building') {
        const cropConfig = CONFIG.crops[cell.type];
        if (cropConfig) {
          const elapsed = (Date.now() - cell.plantedAt) / 1000;
          if (elapsed >= cropConfig.time) {
            state.data.coins += cropConfig.sell;
            state.data.cells[index] = null;
            harvested++;
            totalEarnings += cropConfig.sell;
          }
        }
      }
    });
    
    if (harvested > 0) {
      state.save();
      this.renderGrid();
      showToast(`🌾 Собрано: ${harvested} шт. (+${totalEarnings}💰)`);
    } else {
      showToast('⏳ Нечего собирать');
    }
  },

  plantSelected() {
    console.log('Plant selected, count:', this.selectedCells.length);
    if (this.selectedCells.length === 0) {
      showToast('⚠️ Выбери грядки сначала');
      return;
    }

    const cropConfig = CONFIG.crops[this.selectedCrop];
    if (!cropConfig) {
      showToast('⚠️ Выбери культуру');
      return;
    }
    
    const totalCost = cropConfig.cost * this.selectedCells.length;

    if (state.data.coins >= totalCost) {
      state.data.coins -= totalCost;
      
      this.selectedCells.forEach(index => {
        if (!state.data.cells[index]) {
          state.data.cells[index] = { 
            type: this.selectedCrop, 
            plantedAt: Date.now() 
          };
        }
      });
      
      const count = this.selectedCells.length;
      state.save();
      this.selectedCells = [];
      this.renderGrid();
      showToast(`🌱 Посажено: ${count} ${cropConfig.icon}`);
    } else {
      showToast(`❌ Нужно ${totalCost}💰 (не хватает)`);
    }
  },

  updateModeButtons() {
    const btnPlant = document.getElementById('modePlantBtn');
    const btnBuild = document.getElementById('modeBuildBtn');
    const btnSelect = document.getElementById('modeSelectBtn');
    
    if (btnPlant) {
      btnPlant.style.background = this.mode === 'plant' ? 'var(--accent)' : '#e5e7eb';
      btnPlant.style.color = this.mode === 'plant' ? 'white' : '#222';
    }
    if (btnBuild) {
      btnBuild.style.background = this.mode === 'build' ? 'var(--accent)' : '#e5e7eb';
      btnBuild.style.color = this.mode === 'build' ? 'white' : '#222';
    }
    if (btnSelect) {
      btnSelect.style.background = this.mode === 'select' ? 'var(--accent)' : '#e5e7eb';
      btnSelect.style.color = this.mode === 'select' ? 'white' : '#222';
    }
  },

  renderShop() {
    const list = document.getElementById('shop-list');
    if (!list) {
      console.error('Shop list not found');
      return;
    }
    list.innerHTML = '';

    if (this.mode === 'plant') {
      for (const [key, val] of Object.entries(CONFIG.crops)) {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <span>${val.icon} ${val.name}</span>
            <div style="font-size: 12px; color: #888;">${val.time}с | +${val.sell}💰</div>
          </div>
          <button class="btn-vk primary" onclick="game.selectCrop('${key}', this)">${val.cost} 💰</button>
        `;
        list.appendChild(div);
      }
    } else if (this.mode === 'build') {
      for (const [key, val] of Object.entries(CONFIG.buildings)) {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
          <span>${val.icon} ${val.name}</span>
          <button class="btn-vk primary" onclick="game.selectBuild('${key}', this)">${val.cost} 💰</button>
        `;
        list.appendChild(div);
      }
    }
  },

  selectCrop(crop, btn) {
    console.log('Select crop:', crop, 'mode:', this.mode);
    this.selectedCrop = crop;
    this.selectedBuild = null;
    
    if (this.mode === 'select') {
      this.plantSelected();
      document.getElementById('shopModal').style.display = 'none';
    } else {
      document.getElementById('shopModal').style.display = 'none';
      showToast(`Выбрано: ${CONFIG.crops[crop].icon} ${CONFIG.crops[crop].name}`);
    }
  },

  selectBuild(build, btn) {
    this.selectedBuild = build;
    this.selectedCrop = null;
    document.getElementById('shopModal').style.display = 'none';
    showToast(`Выбрано: ${CONFIG.buildings[build].icon} ${CONFIG.buildings[build].name}`);
  },

  showShop() { 
    console.log('Show shop');
    document.getElementById('shopModal').style.display = 'flex'; 
  },
  
  closeShop(e) { 
    if (!e.target.classList.contains('modal-card')) {
      document.getElementById('shopModal').style.display = 'none'; 
    }
  },

  buyLand() {
    const landCost = 100;
    if (state.data.coins >= landCost) {
      state.data.coins -= landCost;
      this.unlockedCells += 5;
      state.save();
      this.renderGrid();
      this.updateLandButton();
      showToast(`🌍 Куплено! Теперь ${this.unlockedCells} клеток`);
    } else {
      showToast(`❌ Нужно ${landCost} монет`);
    }
  },

  updateLandButton() {
    const btn = document.getElementById('buyLandBtn');
    if(btn) {
      btn.textContent = `🌍 Купить землю (100💰)`;
      btn.disabled = state.data.coins < 100;
    }
  },

  handleCellClick(index) {
    console.log('Cell clicked:', index, 'mode:', this.mode);
    
    if (this.mode === 'select') {
      const cell = state.data.cells[index];
      
      if (!cell) {
        const cellIndex = this.selectedCells.indexOf(index);
        if (cellIndex > -1) {
          this.selectedCells.splice(cellIndex, 1);
          console.log('Deselected cell:', index);
        } else {
          this.selectedCells.push(index);
          console.log('Selected cell:', index, 'total:', this.selectedCells.length);
        }
        this.renderGrid();
        showToast(`📋 Выбрано: ${this.selectedCells.length} грядок`);
      }
      return;
    }

    if (this.mode === 'build') {
      const cell = state.data.cells[index];
      if (!cell) {
        const buildKey = this.selectedBuild;
        if (buildKey) {
          const buildData = CONFIG.buildings[buildKey];
          if (state.data.coins >= buildData.cost) {
            state.data.coins -= buildData.cost;
            state.data.cells[index] = { type: 'building', subtype: buildKey };
            state.save();
            this.renderGrid();
          } else { showToast('❌ Нет монет'); }
        } else { showToast('⚠️ Выбери постройку в магазине'); }
      } else {
        showToast('🚧 Тут уже что-то стоит');
      }
      return;
    }

    const cell = state.data.cells[index];
    if (!cell) {
      const cropConfig = CONFIG.crops[this.selectedCrop];
      if (state.data.coins >= cropConfig.cost) {
        state.data.coins -= cropConfig.cost;
        state.data.cells[index] = { type: this.selectedCrop, plantedAt: Date.now() };
        state.save();
        this.renderGrid();
      } else { showToast('❌ Нет монет'); }
    } else {
      if (cell.type === 'building') return;

      const cropConfig = CONFIG.crops[cell.type];
      if (cropConfig) {
        const elapsed = (Date.now() - cell.plantedAt) / 1000;
        if (elapsed >= cropConfig.time) {
          state.data.coins += cropConfig.sell;
          state.data.cells[index] = null;
          state.save();
          this.renderGrid();
          showToast(`💰 +${cropConfig.sell}`);
        } else { 
          showToast(`⏳ Жди ${Math.ceil(cropConfig.time - elapsed)}с`); 
        }
      }
    }
  },

  renderGrid() {
    const grid = document.getElementById('grid');
    if (!grid) {
      console.error('Grid not found');
      return;
    }
    
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    grid.innerHTML = '';
    
    const coinCount = document.getElementById('coinCount');
    if (coinCount) coinCount.textContent = state.data.coins;

    for (let i = 0; i < this.unlockedCells; i++) {
      const cell = state.data.cells[i];
      const div = document.createElement('div');
      div.className = 'cell';
      
      if (this.selectedCells.includes(i)) {
        div.style.boxShadow = '0 0 0 3px #10b981, inset 2px 2px 4px rgba(255,255,255,0.4)';
        div.style.background = 'rgba(16, 185, 129, 0.3)';
      }
      
      if (!cell) {
        div.classList.add('empty');
      } else if (cell.type === 'building') {
        const buildData = CONFIG.buildings[cell.subtype];
        div.classList.add('filled');
        div.innerHTML = `<div style="font-size: 30px;">${buildData.icon}</div>`;
      } else {
        const cropConfig = CONFIG.crops[cell.type];
        if (!cropConfig) continue;
        
        const elapsed = Math.floor((Date.now() - cell.plantedAt) / 1000);
        const progress = Math.min(elapsed / cropConfig.time, 1);
        const stageIndex = Math.min(Math.floor(progress * 2.99), 2);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'plant-wrapper';
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 32 32");
        svg.classList.add('plant-svg');
        if (progress >= 1) svg.classList.add('grown');
        
        const plantData = CONFIG.svg[cell.type];
        if (plantData && plantData.stages && plantData.stages[stageIndex]) {
          svg.innerHTML = plantData.stages[stageIndex];
        } else {
          svg.innerHTML = `<circle cx="16" cy="16" r="10" fill="#FF5722"/>`;
        }
        
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
      
      div.onclick = () => {
        if (navigator.vibrate) navigator.vibrate(10);
        this.handleCellClick(i);
      };
      
      grid.appendChild(div);
    }
    
    this.updateLandButton();
  },

  loop() {
    this.renderGrid();
    setTimeout(() => this.loop(), 500);
  }
};
