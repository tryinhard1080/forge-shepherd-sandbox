import { test } from 'node:test';
import assert from 'node:assert/strict';
import { total, addTax, parseQuantity, formatPrice, searchItems, highlightMatch } from '../src/price.mjs';

test('total sums price times quantity', () => {
  assert.equal(total([{ price: 2, qty: 3 }, { price: 5, qty: 1 }]), 11);
});

test('total throws RangeError for a negative quantity', () => {
  assert.throws(() => total([{ price: 2, qty: -1 }]), RangeError);
});

test('total throws RangeError for a negative price', () => {
  assert.throws(() => total([{ price: -2, qty: 1 }]), RangeError);
});

test('total still accepts zero price and zero quantity', () => {
  assert.equal(total([{ price: 0, qty: 3 }, { price: 5, qty: 0 }]), 0);
});

test('total throws RangeError when both price and quantity are negative', () => {
  assert.throws(() => total([{ price: -2, qty: -1 }]), RangeError);
});

test('addTax adds a whole-number percent of tax', () => {
  assert.equal(addTax(100, 10), 110);
});

test('addTax rounds to the nearest cent', () => {
  assert.equal(addTax(19.99, 7), 21.39);
});

test('addTax accepts a fractional percent and rounds a half cent up', () => {
  assert.equal(addTax(10, 8.25), 10.83);
});

test('addTax rounds a half cent up despite floating-point error', () => {
  // 1.15 * 1.10 is exactly 1.265, but in floating point it lands just below the half cent.
  assert.equal(addTax(1.15, 10), 1.27);
  assert.equal(addTax(4.35, 10), 4.79);
});

test('addTax with a zero rate returns the amount', () => {
  assert.equal(addTax(42.5, 0), 42.5);
});

test('parseQuantity trims whitespace and returns a whole number', () => {
  assert.equal(parseQuantity(' 3 '), 3);
  assert.equal(parseQuantity('\t42\n'), 42);
});

test('parseQuantity accepts a whole number written with a zero fraction', () => {
  assert.equal(parseQuantity('2.0'), 2);
  assert.equal(parseQuantity('7.00'), 7);
});

test('parseQuantity accepts the bounds 0 and 999', () => {
  assert.equal(parseQuantity('0'), 0);
  assert.equal(parseQuantity('999'), 999);
  assert.equal(parseQuantity('007'), 7);
});

test('parseQuantity rejects a value that is not a string', () => {
  assert.throws(() => parseQuantity(3), { name: 'RangeError', message: /must be a string/ });
  assert.throws(() => parseQuantity(undefined), { name: 'RangeError', message: /must be a string/ });
});

test('parseQuantity rejects an empty or blank string', () => {
  assert.throws(() => parseQuantity(''), { name: 'RangeError', message: /empty/ });
  assert.throws(() => parseQuantity('   '), { name: 'RangeError', message: /empty/ });
});

test('parseQuantity rejects text that is not a plain number', () => {
  for (const bad of ['abc', '3 apples', '1e2', '0x10', '1,000', '+3', '.5', '2.', 'Infinity', 'NaN']) {
    assert.throws(() => parseQuantity(bad), { name: 'RangeError', message: /not a number/ }, bad);
  }
});

test('parseQuantity rejects a negative number', () => {
  assert.throws(() => parseQuantity('-1'), { name: 'RangeError', message: /negative/ });
  assert.throws(() => parseQuantity('-0'), { name: 'RangeError', message: /negative/ });
});

test('parseQuantity rejects a fractional number', () => {
  assert.throws(() => parseQuantity('2.5'), { name: 'RangeError', message: /whole number/ });
  assert.throws(() => parseQuantity('0.01'), { name: 'RangeError', message: /whole number/ });
});

test('parseQuantity rejects a number above 999', () => {
  assert.throws(() => parseQuantity('1000'), { name: 'RangeError', message: /at most 999/ });
  assert.throws(() => parseQuantity('99999999999999999999'), { name: 'RangeError', message: /at most 999/ });
});

test('parseQuantity error message echoes the input', () => {
  assert.throws(() => parseQuantity('abc'), { message: /"abc"/ });
  assert.throws(() => parseQuantity('  '), { message: /"  "/ });
  assert.throws(() => parseQuantity('-1'), { message: /"-1"/ });
  assert.throws(() => parseQuantity('2.5'), { message: /"2\.5"/ });
  assert.throws(() => parseQuantity('1000'), { message: /"1000"/ });
});

test('formatPrice shows dollars with thousands separators and two decimals', () => {
  assert.equal(formatPrice(1234.5), '$1,234.50');
  assert.equal(formatPrice(1234567.89), '$1,234,567.89');
  assert.equal(formatPrice(999), '$999.00');
  assert.equal(formatPrice(1000), '$1,000.00');
});

test('formatPrice shows small amounts with a leading zero', () => {
  assert.equal(formatPrice(0.05), '$0.05');
  assert.equal(formatPrice(0), '$0.00');
});

test('formatPrice puts the minus before the dollar sign for refunds', () => {
  assert.equal(formatPrice(-3), '-$3.00');
  assert.equal(formatPrice(-1234.5), '-$1,234.50');
});

test('formatPrice rounds to the nearest cent', () => {
  assert.equal(formatPrice(2.344), '$2.34');
  assert.equal(formatPrice(2.346), '$2.35');
  assert.equal(formatPrice(1.005), '$1.01');
  assert.equal(formatPrice(-1.005), '-$1.01');
  assert.equal(formatPrice(999.999), '$1,000.00');
});

test('formatPrice never shows a negative zero', () => {
  assert.equal(formatPrice(-0), '$0.00');
  assert.equal(formatPrice(-0.004), '$0.00');
});

test('formatPrice throws RangeError for non-finite or non-number amounts', () => {
  assert.throws(() => formatPrice(NaN), RangeError);
  assert.throws(() => formatPrice(Infinity), RangeError);
  assert.throws(() => formatPrice('5'), RangeError);
});

test('formatPrice throws RangeError even for inputs that cannot become strings', () => {
  assert.throws(() => formatPrice(Symbol('price')), RangeError);
  assert.throws(() => formatPrice(Object.create(null)), RangeError);
});

const cart = [
  { name: 'Butter 1/2 lb (fresh)', price: 4 },
  { name: 'C++ Primer', price: 50 },
  { name: 'Carrots', price: 2 },
  { name: 'Apple.Juice', price: 3 },
];

test('searchItems matches name substrings ignoring case, keeping order', () => {
  assert.deepEqual(searchItems(cart, 'CAR').map(i => i.name), ['Carrots']);
  assert.deepEqual(searchItems(cart, 'c').map(i => i.name), ['C++ Primer', 'Carrots', 'Apple.Juice']);
});

test('searchItems matches regex metacharacters literally', () => {
  assert.deepEqual(searchItems(cart, '1/2 lb (fresh)').map(i => i.name), ['Butter 1/2 lb (fresh)']);
  assert.deepEqual(searchItems(cart, 'c++').map(i => i.name), ['C++ Primer']);
  assert.deepEqual(searchItems(cart, 'e.j').map(i => i.name), ['Apple.Juice']);
  assert.deepEqual(searchItems(cart, '.'), [cart[3]]);
  assert.deepEqual(searchItems(cart, '(fresh'), [cart[0]]);
  assert.deepEqual(searchItems(cart, '[a-z]'), []);
});

test('searchItems returns nothing when no name contains the query', () => {
  assert.deepEqual(searchItems(cart, 'milk'), []);
});

test('searchItems with an empty query returns every item', () => {
  assert.deepEqual(searchItems(cart, ''), cart);
});

test('searchItems throws RangeError for a non-string query', () => {
  assert.throws(() => searchItems(cart, null), RangeError);
});

test('highlightMatch wraps a case-insensitive match, keeping the name casing', () => {
  assert.equal(highlightMatch('Fresh c++ book', 'C++'), 'Fresh [c++] book');
});

test('highlightMatch wraps every occurrence', () => {
  assert.equal(highlightMatch('Apple and apple pie', 'APPLE'), '[Apple] and [apple] pie');
});

test('highlightMatch treats the query as literal text, not a pattern', () => {
  assert.equal(highlightMatch('Beef 1/2 lb (fresh)', '1/2 lb (fresh)'), 'Beef [1/2 lb (fresh)]');
  assert.equal(highlightMatch('Price $5.00 or 5x00', '5.00'), 'Price $[5.00] or 5x00');
  assert.equal(highlightMatch('a.b*c?', '.*'), 'a.b*c?');
  assert.equal(highlightMatch('Tea [green]', '[green]'), 'Tea [[green]]');
  assert.equal(highlightMatch('a|b ab', 'a|b'), '[a|b] ab');
  assert.equal(highlightMatch('x^y', '^y'), 'x[^y]');
  assert.equal(highlightMatch('cost $5', '$5'), 'cost [$5]');
  assert.equal(highlightMatch('a{2} aa', 'a{2}'), '[a{2}] aa');
  assert.equal(highlightMatch('a\\b', '\\'), 'a[\\]b');
});

test('highlightMatch returns the name unchanged when nothing matches', () => {
  assert.equal(highlightMatch('Milk', 'bread'), 'Milk');
});

test('highlightMatch returns the name unchanged for an empty query', () => {
  assert.equal(highlightMatch('Milk', ''), 'Milk');
});

test('highlightMatch throws RangeError for a non-string query', () => {
  assert.throws(() => highlightMatch('Milk', null), RangeError);
});
