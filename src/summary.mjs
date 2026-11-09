import { total, roundCents } from './price.mjs';
import { applyDiscount } from './discount.mjs';

// Order summary for checkout, in dollars rounded to the cent. The subtotal is
// rounded first and the discount is taken as subtotal minus the rounded total,
// so the three figures always reconcile: subtotal - discount === total.
// percent follows applyDiscount: clamped to 0-100, missing or negative is none.
// Invalid items (negative qty or price) throw RangeError from total().
export function orderSummary(items, percent) {
  const subtotal = roundCents(total(items));
  const discounted = roundCents(applyDiscount(subtotal, percent));
  return { subtotal, discount: roundCents(subtotal - discounted), total: discounted };
}
