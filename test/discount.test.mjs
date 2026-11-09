import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDiscount, bulkPrice } from '../src/discount.mjs';

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

test('bulkPrice charges full price below 10', () => {
  assert.equal(bulkPrice(2, 1), 2);
  assert.equal(bulkPrice(2, 9), 18);
});

test('bulkPrice takes 10% off the line from 10 up to 49', () => {
  assert.equal(bulkPrice(2, 10), 18);
  assert.equal(bulkPrice(2, 49), 88.2);
});

test('bulkPrice takes 20% off the line at 50 or more', () => {
  assert.equal(bulkPrice(2, 50), 80);
  assert.equal(bulkPrice(2, 100), 160);
});

test('bulkPrice rounds the line total to the nearest cent', () => {
  assert.equal(bulkPrice(0.35, 10), 3.15);
  assert.equal(bulkPrice(1.99, 3), 5.97);
  assert.equal(bulkPrice(0.33, 50), 13.2);
  // 0.15 * 11 * 0.9 = 1.485: an exact half cent rounds up
  assert.equal(bulkPrice(0.15, 11), 1.49);
});

test('bulkPrice of zero quantity is zero', () => {
  assert.equal(bulkPrice(5, 0), 0);
});
