// Loyalty points for an order: 1 point per whole dollar of `orderTotal`,
// doubled when the order is $100 or more. Throws RangeError when the total
// is negative or not a finite number.
export function loyaltyPoints(orderTotal) {
  if (!Number.isFinite(orderTotal) || orderTotal < 0) {
    // typeof, not String(): String() itself throws for some objects and symbols.
    const got = typeof orderTotal === 'number' ? orderTotal : typeof orderTotal;
    throw new RangeError(`order total must be a finite number >= 0, got ${got}`);
  }
  // Math.max turns -0 into 0.
  const points = Math.max(0, Math.floor(orderTotal));
  return orderTotal >= 100 ? points * 2 : points;
}
