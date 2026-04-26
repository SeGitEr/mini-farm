const game = {
  selectedCrop: 'wheat',
  selectedBuild: null,
  mode: 'plant', // 'plant' или 'build'
  unlockedCells: 25, // Начинаем с 25 клеток (5x5)

  init() {
    this.renderShop();
    this.loop();
    this.updateLandButton();
  },

  // Переключение режима (Сажаем или Строим)
  setMode(mode) {
    this.mode = mode;
    showToast(mode === 'plant' ? '🌱 Режим посадки' : '🔨 Режим стройки');
    
    // Обновляем вид кнопок режима (визуально)
    const btnPlant = document.getElementById('modePlantBtn');
    const btnBuild = document.getElementById('modeBuildBtn');
    
    if(btnPlant && btnBuild) {
      btnPlant.style.background = mode === 'plant' ? 'var(--accent)' : '#e5e7eb';
      btnPlant.style.color = mode === 'plant' ? 'white' : '#222';
      btnBuild.style.background = mode === 'build' ? 'var(--accent)' : '#e5e7eb';
      btnBuild.style.color = mode === 'build' ? 'white' : '#222';
    }
  },

  renderShop() {
    const list = document.getElementById('shop-list');
    if (!list) return;
    list.innerHTML = '';

    // Если режим посадки - показываем семена
    if (this.mode === 'plant') {
      for (const [key, val] of Object.entries(CONFIG.crops)) {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
          <span>${val.icon} ${key} (${val.time}с)</span>
          <button class="btn-vk primary" onclick="game.selectCrop('${key}', this)">${val.cost} 💰</button>
        `;
        list.appendChild(div);
      }
    } 
    // Если режим стройки - показываем заборы/деревья
    else {
      for (const [key, val] of Object.entries(CONFIG.buildings)) {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
          <span>${val.icon} ${key}</span>
          <button class="btn-vk primary" onclick="game.selectBuild('${key}', this)">${val.cost} 💰</button>
        `;
        list.appendChild(div);
      }
    }
  },

  selectCrop(crop, btn) {
    this.selectedCrop = crop;
    this.selectedBuild = null;
    document.getElementById('shopModal').style.display = 'none';
    showToast(`Выбрано: ${CONFIG.crops[crop].icon} ${crop}`);
  },

  selectBuild(build, btn) {
    this.selectedBuild = build;
    this.selectedCrop = null;
    document.getElementById('shopModal').style.display = 'none';
    showToast(`Выбрано: ${CONFIG.buildings[build].icon} ${build}`);
  },

  showShop() { document.getElementById('shopModal').style.display = 'flex'; },
  closeShop(e) { 
    if (!e.target.classList.contains('modal-card')) document.getElementById('shopModal').style.display = 'none'; 
  },

  // Покупка новой земли
  buyLand() {
    const landCost = 100; // Цена за 5 новых клеток
    if (state.data.coins >= landCost) {
      state.data.coins -= landCost;
      this.unlockedCells += 5; // Добавляем ряд
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
    const cell = state.data.cells[index];

    // 1. Логика СТРОЙКИ (заборы, декор)
    if (this.mode === 'build') {
      if (!cell) {
        const buildKey = this.selectedBuild;
        if (buildKey) {
          const buildData = CONFIG.buildings[buildKey];
          if (state.data.coins >= buildData.cost) {
            state.data.coins -= buildData.cost;
            // Сохраняем как постройку (без таймера)
            state.data.cells[index] = { type: 'building', subtype: buildKey }; 
            state.save();
            this.renderGrid();
          } else { showToast('❌ Нет монет'); }
        } else { showToast('⚠️ Выбери постройку в магазине'); }
      } else {
        // Если кликнули на занятую клетку в режиме стройки - можно снести? (пока просто сообщение)
        showToast('🚧 Тут уже что-то стоит');
      }
      return;
    }

    // 2. Логика ПОСАДКИ (растения)
    if (!cell) {
      // Сажаем
      const cropConfig = CONFIG.crops[this.selectedCrop];
      if (state.data.coins >= cropConfig.cost) {
        state.data.coins -= cropConfig.cost;
        state.data.cells[index] = { type: this.selectedCrop, plantedAt: Date.now() };
        state.save();
        this.renderGrid();
      } else { showToast('❌ Нет монет'); }
    } else {
      // Собираем урожай
      if (cell.type === 'building') return; // Нельзя собрать забор

      const cropConfig = CONFIG.crops[cell.type];
      if (cropConfig) {
        const elapsed = (Date.now() - cell.plantedAt) / 1000;
        if (elapsed >= cropConfig.time) {
          state.data.coins += cropConfig.sell;
          state.data.cells[index] = null; // Убираем растение
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
    if (!grid) return;
    
    // Динамическое изменение колонок в зависимости от количества клеток
    // Для простоты пока оставим 5 колонок, но добавим больше рядов вниз
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    
    grid.innerHTML = '';
    const coinCount = document.getElementById('coinCount');
    if (coinCount) coinCount.textContent = state.data.coins;

    // Рендерим только unlockedCells
    for (let i = 0; i < this.unlockedCells; i++) {
      const cell = state.data.cells[i];
      const div = document.createElement('div');
      div.className = 'cell';
      
      // Если клетка пустая
      if (!cell) {
        div.classList.add('empty');
      } 
      // Если это ПОСТРОЙКА (забор/дерево)
      else if (cell.type === 'building') {
        const buildData = CONFIG.buildings[cell.subtype];
        div.classList.add('filled');
        // Для построек используем простой эмодзи, так как они статичные
        div.innerHTML = `<div style="font-size: 30px;">${buildData.icon}</div>`;
      } 
      // Если это РАСТЕНИЕ
      else {
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
    
    // Обновляем кнопку покупки земли
    this.updateLandButton();
  },

  loop() {
    this.renderGrid();
    setTimeout(() => this.loop(), 500);
  }
};
