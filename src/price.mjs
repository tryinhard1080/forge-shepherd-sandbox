export function total(items) {
  return items.reduce((sum, i) => {
    if (i.qty < 0) throw new RangeError(`qty must not be negative, got ${i.qty}`);
    if (i.price < 0) throw new RangeError(`price must not be negative, got ${i.price}`);
    return sum + i.price * i.qty;
  }, 0);
}

// Returns amount plus percent% tax, rounded to the nearest cent (halves up).
// toPrecision(15) strips floating-point noise (e.g. 126.49999999999999 -> 126.5)
// so exact half cents round up as expected.
export function addTax(amount, percent) {
  const cents = (amount + amount * percent / 100) * 100;
  return Math.round(Number(cents.toPrecision(15))) / 100;
}
