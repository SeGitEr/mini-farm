const CONFIG = {
  crops: {
    wheat:   { cost: 10,  time: 10,  sell: 15,  icon: '🌾', name: 'Пшеница' },
    potato:  { cost: 25,  time: 25,  sell: 40,  icon: '🥔', name: 'Картофель' },
    carrot:  { cost: 40,  time: 40,  sell: 65,  icon: '🥕', name: 'Морковь' },
    tomato:  { cost: 70,  time: 60,  sell: 110, icon: '🍅', name: 'Томат' },
    corn:    { cost: 100, time: 90,  sell: 160, icon: '🌽', name: 'Кукуруза' },
    strawberry: { cost: 150, time: 120, sell: 250, icon: '🍓', name: 'Клубника' }
  },
  
  buildings: {
    fence: { cost: 5, type: 'decor', icon: '🪵', name: 'Забор' },
    tree:  { cost: 15, type: 'decor', icon: '🌳', name: 'Дерево' },
    bush:  { cost: 8, type: 'decor', icon: '🌿', name: 'Куст' },
    rock:  { cost: 3, type: 'decor', icon: '🪨', name: 'Камень' }
  },

  svg: {
    wheat: {
      stages: [
        `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
        `<rect x="14" y="10" width="4" height="12" fill="#8BC34A"/><circle cx="16" cy="10" r="3" fill="#CDDC39"/>`,
        `<path d="M16 24 L16 8 M16 14 L10 10 M16 14 L22 10 M16 8 L12 4 M16 8 L20 4" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/>`
      ]
    },
    potato: {
      stages: [
        `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
        `<rect x="14" y="12" width="4" height="10" fill="#8BC34A"/><circle cx="16" cy="12" r="3" fill="#66BB6A"/>`,
        `<ellipse cx="16" cy="18" rx="8" ry="6" fill="#8D6E63"/><circle cx="14" cy="16" r="2" fill="#A1887F"/><circle cx="18" cy="18" r="2" fill="#A1887F"/>`
      ]
    },
    carrot: {
      stages: [
        `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
        `<rect x="14" y="12" width="4" height="10" fill="#8BC34A"/><circle cx="16" cy="12" r="3" fill="#66BB6A"/>`,
        `<path d="M16 24 L16 6 L12 4 M16 6 L20 4 M16 14 L10 14 M16 18 L22 18" stroke="#FF5722" stroke-width="3" stroke-linecap="round"/>`
      ]
    },
    tomato: {
      stages: [
        `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
        `<rect x="14" y="14" width="4" height="8" fill="#8BC34A"/><circle cx="16" cy="14" r="3" fill="#4CAF50"/>`,
        `<circle cx="16" cy="16" r="6" fill="#F44336"/><path d="M16 10 L16 6" stroke="#4CAF50" stroke-width="2"/>`
      ]
    },
    corn: {
      stages: [
        `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
        `<rect x="14" y="10" width="4" height="12" fill="#8BC34A"/><circle cx="16" cy="10" r="3" fill="#66BB6A"/>`,
        `<rect x="12" y="10" width="8" height="14" fill="#FFD54F" rx="2"/><path d="M12 12 Q16 8 20 12" fill="none" stroke="#8BC34A" stroke-width="2"/>`
      ]
    },
    strawberry: {
      stages: [
        `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
        `<rect x="14" y="14" width="4" height="8" fill="#8BC34A"/><circle cx="16" cy="14" r="3" fill="#4CAF50"/>`,
        `<path d="M16 22 L12 16 Q16 12 20 16 Z" fill="#F44336"/><circle cx="14" cy="18" r="1" fill="#FFCDD2"/><circle cx="18" cy="18" r="1" fill="#FFCDD2"/><path d="M16 16 L14 14 M16 16 L18 14 M16 16 L16 13" stroke="#4CAF50" stroke-width="1.5"/>`
      ]
    }
  }
};
