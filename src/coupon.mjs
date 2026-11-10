// Normalise a coupon code a shopper typed: trim it, check it is 4 to 12
// ASCII letters or digits, and return it upper-cased.
export function normalizeCoupon(code) {
  if (typeof code !== 'string') throw new RangeError(`coupon code must be a string, got ${describeType(code)}`);
  const trimmed = code.trim();
  const chars = [...trimmed];
  if (chars.length < 4 || chars.length > 12) {
    throw new RangeError(`coupon code must be 4 to 12 characters after trimming, got ${chars.length}`);
  }
  const bad = chars.find((c) => !/^[A-Za-z0-9]$/.test(c));
  if (bad !== undefined) {
    throw new RangeError(`coupon code may contain only letters and digits, found "${bad}"`);
  }
  return trimmed.toUpperCase();
}

function describeType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}
