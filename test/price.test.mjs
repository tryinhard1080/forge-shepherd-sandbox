import { test } from 'node:test';
import assert from 'node:assert/strict';
import { total } from '../src/price.mjs';

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
