import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateShipping } from '../src/shipping.mjs';

test('estimateShipping charges the $4.99 base up to and including 1 kg', () => {
  assert.equal(estimateShipping(0.1), 4.99);
  assert.equal(estimateShipping(0.5), 4.99);
  assert.equal(estimateShipping(1), 4.99);
});

test('estimateShipping adds $1.50 for each further started kg', () => {
  assert.equal(estimateShipping(1.01), 6.49);
  assert.equal(estimateShipping(1.2), 6.49);
  assert.equal(estimateShipping(2), 6.49);
  assert.equal(estimateShipping(2.01), 7.99);
  assert.equal(estimateShipping(3), 7.99);
  assert.equal(estimateShipping(10.5), 19.99);
});

test('estimateShipping rounds the result to the cent', () => {
  // 4.99 + 1.5 * 13 = 24.490000000000002 in floating point
  assert.equal(estimateShipping(14), 24.49);
  assert.equal(estimateShipping(19), 31.99);
  assert.equal(estimateShipping(19.99), 33.49);
});

test('estimateShipping is free at 20 kg or more', () => {
  assert.equal(estimateShipping(20), 0);
  assert.equal(estimateShipping(20.5), 0);
  assert.equal(estimateShipping(1000), 0);
});

test('estimateShipping throws a RangeError for a weight that is not a positive finite number', () => {
  for (const bad of [0, -0, -1, -0.5, NaN, Infinity, -Infinity, '5', null, undefined, {}]) {
    assert.throws(() => estimateShipping(bad), RangeError, `expected RangeError for ${String(bad)}`);
  }
  assert.throws(() => estimateShipping(), RangeError);
});

test('estimateShipping throws a RangeError even for a value that cannot be turned into a string', () => {
  assert.throws(() => estimateShipping(Object.create(null)), RangeError);
  assert.throws(() => estimateShipping({ toString() { throw new Error('boom'); } }), RangeError);
});
