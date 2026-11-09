import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundCents } from '../src/price.mjs';
import { orderSummary } from '../src/summary.mjs';

test('roundCents rounds to the nearest cent', () => {
  assert.equal(roundCents(1.234), 1.23);
  assert.equal(roundCents(1.236), 1.24);
  assert.equal(roundCents(5), 5);
});

test('roundCents rounds exact half cents up despite float noise', () => {
  assert.equal(roundCents(1.005), 1.01);
  assert.equal(roundCents(1.265), 1.27);
});

test('orderSummary with no discount', () => {
  assert.deepEqual(orderSummary([{ price: 2, qty: 3 }, { price: 5, qty: 1 }], 0),
    { subtotal: 11, discount: 0, total: 11 });
});

test('orderSummary applies a percent discount', () => {
  assert.deepEqual(orderSummary([{ price: 20, qty: 2 }, { price: 10, qty: 1 }], 10),
    { subtotal: 50, discount: 5, total: 45 });
});

test('orderSummary rounds every figure to the cent', () => {
  // subtotal 0.1 * 3 = 0.30000000000000004; 15% of 19.99 = 2.9985
  assert.deepEqual(orderSummary([{ price: 0.1, qty: 3 }], 0),
    { subtotal: 0.3, discount: 0, total: 0.3 });
  assert.deepEqual(orderSummary([{ price: 19.99, qty: 1 }], 15),
    { subtotal: 19.99, discount: 3, total: 16.99 });
});

test('orderSummary subtotal minus discount equals total to the cent', () => {
  for (const percent of [1, 7, 12.5, 33, 66.6]) {
    const s = orderSummary([{ price: 9.99, qty: 3 }, { price: 0.35, qty: 7 }], percent);
    assert.equal(roundCents(s.subtotal - s.discount), s.total, `percent ${percent}`);
  }
});

test('orderSummary follows applyDiscount clamping for out-of-range percents', () => {
  const items = [{ price: 12.5, qty: 2 }];
  assert.deepEqual(orderSummary(items, 150), { subtotal: 25, discount: 25, total: 0 });
  assert.deepEqual(orderSummary(items, -5), { subtotal: 25, discount: 0, total: 25 });
  assert.deepEqual(orderSummary(items, undefined), { subtotal: 25, discount: 0, total: 25 });
});

test('orderSummary of an empty order is all zero', () => {
  assert.deepEqual(orderSummary([], 10), { subtotal: 0, discount: 0, total: 0 });
});

test('orderSummary rejects invalid items via total()', () => {
  assert.throws(() => orderSummary([{ price: 2, qty: -1 }], 10), RangeError);
});
