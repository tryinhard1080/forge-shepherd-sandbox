import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wishlistTotal } from '../src/wishlist-total.mjs';
import { orderSummary } from '../src/summary.mjs';

const list = [{ name: 'mug', price: 8, qty: 2 }, { name: 'lamp', price: 30, qty: 1 }];

test('wishlistTotal with no discount is the plain total', () => {
  assert.equal(wishlistTotal(list, 0), 46);
});

test('wishlistTotal applies a percent discount', () => {
  assert.equal(wishlistTotal(list, 10), 41.4);
  assert.equal(wishlistTotal(list, 50), 23);
});

test('wishlistTotal rounds to the cent, half cents up', () => {
  // 0.1 * 3 = 0.30000000000000004
  assert.equal(wishlistTotal([{ name: 'a', price: 0.1, qty: 3 }], 0), 0.3);
  // 15% off 19.99 = 16.9915 -> 16.99
  assert.equal(wishlistTotal([{ name: 'a', price: 19.99, qty: 1 }], 15), 16.99);
  // 25% off 0.10 = 0.075 -> 0.08
  assert.equal(wishlistTotal([{ name: 'a', price: 0.1, qty: 1 }], 25), 0.08);
});

test('wishlistTotal rounds half cents up despite float noise', () => {
  // subtotal: 1.005 * 100 = 100.49999999999999, must still round to 1.01
  assert.equal(wishlistTotal([{ name: 'a', price: 1.005, qty: 1 }], 0), 1.01);
  // discounted: 50% off 2.01 = 1.005 (same noise), must still round to 1.01
  assert.equal(wishlistTotal([{ name: 'a', price: 2.01, qty: 1 }], 50), 1.01);
  // 50% off 16.65 = 8.325 -> 8.33
  assert.equal(wishlistTotal([{ name: 'a', price: 16.65, qty: 1 }], 50), 8.33);
});

test('wishlistTotal discounts the subtotal rounded to the cent, as checkout does', () => {
  // raw 0.105 rounds to 0.11; half of 0.11 is 0.055 -> 0.06 (half of raw 0.105 would give 0.05)
  assert.equal(wishlistTotal([{ name: 'a', price: 0.105, qty: 1 }], 50), 0.06);
});

test('wishlistTotal always matches the checkout total', () => {
  const items = [{ name: 'a', price: 9.99, qty: 3 }, { name: 'b', price: 0.35, qty: 7 }];
  for (const percent of [0, 1, 7, 12.5, 33, 66.6, 100]) {
    assert.equal(wishlistTotal(items, percent), orderSummary(items, percent).total, `percent ${percent}`);
  }
});

test('wishlistTotal follows applyDiscount clamping', () => {
  assert.equal(wishlistTotal(list, 150), 0);
  assert.equal(wishlistTotal(list, -5), 46);
  assert.equal(wishlistTotal(list, undefined), 46);
});

test('wishlistTotal of an empty list is 0', () => {
  assert.equal(wishlistTotal([], 10), 0);
});

test('wishlistTotal rejects invalid items via total()', () => {
  assert.throws(() => wishlistTotal([{ name: 'a', price: 2, qty: -1 }], 0), RangeError);
  assert.throws(() => wishlistTotal([{ name: 'a', price: -2, qty: 1 }], 0), RangeError);
});
