export function applyDiscount(amount, percent) {
  const clamped = Math.min(100, Math.max(0, percent));
  return amount - amount * clamped / 100;
}
