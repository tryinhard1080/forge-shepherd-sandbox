// percent is clamped to 0-100. A negative, NaN or missing percent means no
// discount; 100 or more means free. The bounds return exactly, so float
// rounding can never push the result below 0 or above the original amount.
export function applyDiscount(amount, percent) {
  if (!(percent > 0)) return amount;
  if (percent >= 100) return 0;
  return amount - amount * percent / 100;
}
