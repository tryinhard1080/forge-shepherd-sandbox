import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartCount } from '../src/price.mjs';

test('cartCount sums every line qty', () => {
  assert.equal(cartCount([{ name: 'a', qty: 2 }, { name: 'b', qty: 3 }, { name: 'c', qty: 1 }]), 6);
});

test('cartCount of an empty cart is 0', () => {
  assert.equal(cartCount([]), 0);
});

test('cartCount counts a zero-qty line as 0', () => {
  assert.equal(cartCount([{ qty: 0 }, { qty: 4 }]), 4);
});

test('cartCount throws RangeError for a negative qty', () => {
  assert.throws(() => cartCount([{ qty: 2 }, { qty: -1 }]), RangeError);
});

test('cartCount throws RangeError for a non-integer qty', () => {
  for (const qty of [1.5, NaN, Infinity, '2', undefined, null]) {
    assert.throws(() => cartCount([{ qty: 1 }, { qty }]), RangeError, `qty ${String(qty)}`);
  }
});
