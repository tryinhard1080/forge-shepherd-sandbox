import { roundCents } from './price.mjs';

// Returns the shipping charge in dollars for a parcel of weightKg kilograms:
// $4.99 up to and including 1 kg, plus $1.50 for each further started kg
// (1.2 kg and 2 kg -> $6.49, 2.01 kg -> $7.99), and free at 20 kg or more.
// The result is rounded to the cent. A weight that is not a positive finite
// number (0, negative, NaN, Infinity, a string, missing) throws a RangeError.
export function estimateShipping(weightKg) {
  if (typeof weightKg !== 'number') {
    throw new RangeError(`weight must be a number, got ${typeof weightKg}`);
  }
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError(`weight must be a positive finite number of kg, got ${weightKg}`);
  }
  if (weightKg >= 20) return 0;
  const extraKg = Math.max(0, Math.ceil(weightKg - 1));
  return roundCents(4.99 + 1.5 * extraKg);
}
