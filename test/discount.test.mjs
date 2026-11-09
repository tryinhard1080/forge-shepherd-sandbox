import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDiscount } from '../src/discount.mjs';

test('applyDiscount takes a whole-number percent off', () => {
  assert.equal(applyDiscount(200, 10), 180);
});

test('applyDiscount treats a negative percent as no discount', () => {
  assert.equal(applyDiscount(200, -10), 200);
});

test('applyDiscount caps a percent above 100 at the full amount', () => {
  assert.equal(applyDiscount(200, 150), 0);
});

test('applyDiscount accepts the 0 and 100 bounds', () => {
  assert.equal(applyDiscount(200, 0), 200);
  assert.equal(applyDiscount(200, 100), 0);
});

test('applyDiscount never goes negative at a capped 100 percent', () => {
  assert.equal(applyDiscount(0.35000000000000003, 100), 0);
  assert.equal(applyDiscount(0.35000000000000003, 150), 0);
});

test('applyDiscount treats a NaN or missing percent as no discount', () => {
  assert.equal(applyDiscount(200, NaN), 200);
  assert.equal(applyDiscount(200), 200);
});
