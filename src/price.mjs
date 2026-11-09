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

// Parses what a shopper typed into a quantity box into a whole number 0-999.
// Surrounding whitespace is ignored and a zero fraction is allowed ("2.0" -> 2).
// Anything else throws a RangeError naming the problem and the input.
export function parseQuantity(input) {
  if (typeof input !== 'string') {
    throw new RangeError(`quantity must be a string, got ${typeof input}`);
  }
  const text = input.trim();
  if (text === '') throw new RangeError(`quantity is empty: "${input}"`);
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(text);
  if (!match) throw new RangeError(`quantity is not a number: "${input}"`);
  const [, sign, whole, fraction = ''] = match;
  if (sign) throw new RangeError(`quantity must not be negative: "${input}"`);
  if (/[^0]/.test(fraction)) throw new RangeError(`quantity must be a whole number: "${input}"`);
  const qty = Number(whole);
  if (qty > 999) throw new RangeError(`quantity must be at most 999: "${input}"`);
  return qty;
}

// Formats a dollar amount for checkout: "$1,234.50", "$0.05", "-$3.00".
// Rounds to the nearest cent (halves away from zero; toPrecision(15) strips
// floating-point noise as in addTax). An amount that rounds to zero is "$0.00".
export function formatPrice(amount) {
  if (typeof amount !== 'number') {
    throw new RangeError(`amount must be a number, got ${typeof amount}`);
  }
  if (!Number.isFinite(amount)) {
    throw new RangeError(`amount must be a finite number, got ${amount}`);
  }
  const cents = Math.round(Number((Math.abs(amount) * 100).toPrecision(15)));
  const dollars = String(Math.floor(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = amount < 0 && cents > 0 ? '-' : '';
  return `${sign}$${dollars}.${String(cents % 100).padStart(2, '0')}`;
}

// Returns the items whose name contains query as typed, ignoring case, in
// their original order. The query is plain text, never a pattern: "c++" and
// "1/2 lb (fresh)" match only names containing those exact characters.
// An empty query matches every item.
export function searchItems(items, query) {
  if (typeof query !== 'string') {
    throw new RangeError(`query must be a string, got ${typeof query}`);
  }
  const needle = query.toLowerCase();
  return items.filter(item => String(item.name ?? '').toLowerCase().includes(needle));
}
