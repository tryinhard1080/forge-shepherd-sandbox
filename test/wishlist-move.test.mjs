import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moveToCart } from '../src/wishlist-move.mjs';

const mug = { name: 'mug', price: 8, qty: 1 };
const lamp = { name: 'lamp', price: 30, qty: 1 };
const pen = { name: 'pen', price: 2, qty: 3 };

test('moveToCart takes the item off the wishlist and appends it to the cart', () => {
  assert.deepEqual(moveToCart([mug, lamp], [pen], 'mug'), { list: [lamp], cart: [pen, mug] });
  assert.deepEqual(moveToCart([mug, lamp], [], 'lamp'), { list: [mug], cart: [lamp] });
});

test('moveToCart moves the item itself, unchanged', () => {
  const { cart } = moveToCart([mug, lamp], [], 'lamp');
  assert.equal(cart[0], lamp);
});

test('moveToCart leaves both input arrays unchanged', () => {
  const list = [mug, lamp];
  const cart = [pen];
  const out = moveToCart(list, cart, 'mug');
  assert.notEqual(out.list, list);
  assert.notEqual(out.cart, cart);
  assert.deepEqual(list, [mug, lamp]);
  assert.deepEqual(cart, [pen]);
});

test('moveToCart appends a separate line when the cart already has that name', () => {
  const inCart = { name: 'mug', price: 8, qty: 4 };
  assert.deepEqual(moveToCart([mug], [inCart], 'mug'), { list: [], cart: [inCart, mug] });
});

test('moveToCart throws a RangeError and changes nothing when the name is not on the wishlist', () => {
  const list = [mug];
  const cart = [lamp];
  assert.throws(() => moveToCart(list, cart, 'lamp'), RangeError);
  assert.throws(() => moveToCart([], [], 'mug'), RangeError);
  assert.throws(() => moveToCart(list, cart, 'Mug'), RangeError);
  assert.deepEqual(list, [mug]);
  assert.deepEqual(cart, [lamp]);
});
