import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteItem } from '../src/cart-delete.mjs';

const apple = { name: 'apple', price: 1, qty: 2 };
const pear = { name: 'pear', price: 2, qty: 1 };
const plum = { name: 'plum', price: 3, qty: 4 };

test('deleteItem removes the item with that name', () => {
  assert.deepEqual(deleteItem([apple, pear, plum], 'pear'), [apple, plum]);
});

test('deleteItem removes the first and last items', () => {
  assert.deepEqual(deleteItem([apple, pear, plum], 'apple'), [pear, plum]);
  assert.deepEqual(deleteItem([apple, pear, plum], 'plum'), [apple, pear]);
  assert.deepEqual(deleteItem([apple], 'apple'), []);
});

test('deleteItem removes only the first item with that name', () => {
  const pear2 = { name: 'pear', price: 9, qty: 9 };
  const result = deleteItem([pear, apple, pear2], 'pear');
  assert.deepEqual(result, [apple, pear2]);
  assert.equal(result[1], pear2);
});

test('deleteItem returns a new array and leaves the input unchanged', () => {
  const items = [apple, pear, plum];
  const result = deleteItem(items, 'pear');
  assert.notEqual(result, items);
  assert.deepEqual(items, [apple, pear, plum]);
});

test('deleteItem throws RangeError when no item has that name', () => {
  assert.throws(() => deleteItem([apple, pear], 'kiwi'), RangeError);
  assert.throws(() => deleteItem([], 'apple'), RangeError);
});

test('deleteItem matches the name exactly', () => {
  assert.throws(() => deleteItem([apple], 'Apple'), RangeError);
  assert.throws(() => deleteItem([apple], 'appl'), RangeError);
});
