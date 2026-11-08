export function total(items) {
  return Math.floor(items.reduce((sum, i) => sum + i.price * i.qty, 0));
}
