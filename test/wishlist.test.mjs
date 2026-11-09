import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addToWishlist, removeFromWishlist } from '../src/wishlist.mjs';

const mug = { name: 'mug', price: 8, qty: 1 };
const lamp = { name: 'lamp', price: 30, qty: 1 };

test('addToWishlist appends the item to a new list', () => {
  assert.deepEqual(addToWishlist([], mug), [mug]);
  assert.deepEqual(addToWishlist([mug], lamp), [mug, lamp]);
});

test('addToWishlist leaves the input list unchanged', () => {
  const list = [mug];
  const next = addToWishlist(list, lamp);
  assert.notEqual(next, list);
  assert.deepEqual(list, [mug]);
});

test('addToWishlist rejects a duplicate name with a RangeError', () => {
  const list = [mug];
  assert.throws(() => addToWishlist(list, { name: 'mug', price: 9, qty: 2 }), RangeError);
  assert.deepEqual(list, [mug]);
});

test('addToWishlist treats names that differ only in case as different', () => {
  assert.deepEqual(addToWishlist([mug], { name: 'Mug', price: 8, qty: 1 }).length, 2);
});

test('removeFromWishlist returns a new list without the named item', () => {
  assert.deepEqual(removeFromWishlist([mug, lamp], 'mug'), [lamp]);
  assert.deepEqual(removeFromWishlist([mug, lamp], 'lamp'), [mug]);
  assert.deepEqual(removeFromWishlist([mug], 'mug'), []);
});

test('removeFromWishlist leaves the input list unchanged', () => {
  const list = [mug, lamp];
  const next = removeFromWishlist(list, 'mug');
  assert.notEqual(next, list);
  assert.deepEqual(list, [mug, lamp]);
});

test('removeFromWishlist throws a RangeError when the name is absent', () => {
  assert.throws(() => removeFromWishlist([mug], 'lamp'), RangeError);
  assert.throws(() => removeFromWishlist([], 'mug'), RangeError);
  assert.throws(() => removeFromWishlist([mug], 'Mug'), RangeError);
});
