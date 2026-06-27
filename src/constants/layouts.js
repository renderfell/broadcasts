export const LAYOUTS = {
  '2x2': { cols: 2, rows: 2, count: 4, label: '2×2' },
  '3x2': { cols: 3, rows: 2, count: 6, label: '3×2' },
  '3x3': { cols: 3, rows: 3, count: 9, label: '3×3' },
};

export const LAYOUT_OPTIONS = Object.entries(LAYOUTS).map(([value, { label }]) => ({
  value,
  label,
}));
