import { roundCents } from './price.mjs';

// Gift wrap costs $2.50 for the first item and $1.00 for each further one.
export function giftWrapFee(itemCount) {
  if (!Number.isInteger(itemCount) || itemCount < 0) throw new RangeError('itemCount must be a whole number, 0 or more');
  if (itemCount === 0) return 0;
  return roundCents(2.5 + (itemCount - 1) * 1.0);
}
