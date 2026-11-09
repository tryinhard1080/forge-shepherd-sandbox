import { total, roundCents } from './price.mjs';
import { applyDiscount } from './discount.mjs';

// What the wishlist would cost at checkout, in dollars rounded to the cent.
// The subtotal is rounded before the discount, as in orderSummary, so this
// always equals orderSummary(list, percent).total. percent follows
// applyDiscount: clamped to 0-100, missing or negative is none. Invalid items
// (negative qty or price) throw RangeError from total().
export function wishlistTotal(list, percent) {
  return roundCents(applyDiscount(roundCents(total(list)), percent));
}
