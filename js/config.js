const CONFIG = {
  crops: {
    wheat: { cost: 10, time: 10, sell: 15 },
    carrot: { cost: 20, time: 20, sell: 30 },
    tomato: { cost: 35, time: 35, sell: 55 }
  },
  // SVG графика (упрощенная для примера)
  svg: {
    wheat: [
      `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
      `<rect x="14" y="10" width="4" height="12" fill="#8BC34A"/><circle cx="16" cy="10" r="3" fill="#CDDC39"/>`,
      `<path d="M16 24 L16 8 M16 14 L10 10 M16 14 L22 10 M16 8 L12 4 M16 8 L20 4" stroke="#FFB300" stroke-width="2" stroke-linecap="round"/>`
    ],
    carrot: [
      `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
      `<rect x="14" y="12" width="4" height="10" fill="#8BC34A"/><circle cx="16" cy="12" r="3" fill="#66BB6A"/>`,
      `<path d="M16 24 L16 6 L12 4 M16 6 L20 4 M16 14 L10 14 M16 18 L22 18" stroke="#FF5722" stroke-width="3" stroke-linecap="round"/>`
    ],
    tomato: [
      `<circle cx="16" cy="20" r="4" fill="#D7CCC8"/>`,
      `<rect x="14" y="14" width="4" height="8" fill="#8BC34A"/><circle cx="16" cy="14" r="3" fill="#4CAF50"/>`,
      `<circle cx="16" cy="16" r="6" fill="#F44336"/><path d="M16 10 L16 6" stroke="#4CAF50" stroke-width="2"/>`
    ]
  }
};