import { test } from 'node:test';
import assert from 'node:assert/strict';
import { total, addTax, parseQuantity } from '../src/price.mjs';

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
});
