import { test } from 'node:test';
import assert from 'node:assert/strict';
import { total, addTax } from '../src/price.mjs';

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
