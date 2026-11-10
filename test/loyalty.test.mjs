import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loyaltyPoints } from '../src/loyalty.mjs';

test('loyaltyPoints gives 1 point per whole dollar below $100', () => {
  assert.equal(loyaltyPoints(0), 0);
  assert.equal(loyaltyPoints(1), 1);
  assert.equal(loyaltyPoints(42), 42);
  assert.equal(loyaltyPoints(99), 99);
});

test('loyaltyPoints ignores fractions of a dollar', () => {
  assert.equal(loyaltyPoints(0.99), 0);
  assert.equal(loyaltyPoints(10.5), 10);
  assert.equal(loyaltyPoints(99.99), 99);
});

test('loyaltyPoints doubles points for orders of $100 or more', () => {
  assert.equal(loyaltyPoints(100), 200);
  assert.equal(loyaltyPoints(100.01), 200);
  assert.equal(loyaltyPoints(150.75), 300);
  assert.equal(loyaltyPoints(1000), 2000);
});

test('loyaltyPoints throws RangeError for a negative total', () => {
  assert.throws(() => loyaltyPoints(-1), RangeError);
  assert.throws(() => loyaltyPoints(-0.01), RangeError);
  assert.throws(() => loyaltyPoints(-100), RangeError);
});

test('loyaltyPoints throws RangeError for a total that is not a finite number', () => {
  for (const bad of [NaN, Infinity, -Infinity, '50', null, undefined, {}, 10n]) {
    assert.throws(() => loyaltyPoints(bad), RangeError, `expected RangeError for ${String(bad)}`);
  }
});

test('loyaltyPoints throws RangeError even for values that cannot be stringified', () => {
  assert.throws(() => loyaltyPoints(Object.create(null)), RangeError);
  assert.throws(() => loyaltyPoints(Symbol('total')), RangeError);
});

test('loyaltyPoints returns 0, not -0, for a total of -0', () => {
  assert.equal(loyaltyPoints(-0), 0);
});

test('loyaltyPoints does not double just below $100', () => {
  assert.equal(loyaltyPoints(99.999), 99);
});
