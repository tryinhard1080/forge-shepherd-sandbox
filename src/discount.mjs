export function applyDiscount(amount, percent) {
  console.log('discount', percent);
  return amount - amount * percent;
}
