// percent is clamped to 0-100. A negative, NaN or missing percent means no
// discount; 100 or more means free. The bounds return exactly, so float
// rounding can never push the result below 0 or above the original amount.
export function applyDiscount(amount, percent) {
  if (!(percent > 0)) return amount;
  if (percent >= 100) return 0;
  return amount - amount * percent / 100;
}

// Line total for qty units at unitPrice, in dollars rounded to the nearest
// cent (halves up). Bulk tiers apply to the whole line and do not stack:
// 10% off at 10 or more, 20% off at 50 or more. toPrecision(15) strips
// floating-point noise so exact half cents round up, as in addTax.
export function bulkPrice(unitPrice, qty) {
  const percent = qty >= 50 ? 20 : qty >= 10 ? 10 : 0;
  const cents = applyDiscount(unitPrice * qty, percent) * 100;
  return Math.round(Number(cents.toPrecision(15))) / 100;
}
