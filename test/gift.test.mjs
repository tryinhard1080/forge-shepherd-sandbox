import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giftWrapFee } from '../src/gift.mjs';

test('gift wrap is $2.50 for one item and $1.00 for each further one', () => {
  assert.equal(giftWrapFee(0), 0);
  assert.equal(giftWrapFee(1), 2.5);
  assert.equal(giftWrapFee(3), 4.5);
});

test('a count that is not a whole number, 0 or more, is a RangeError', () => {
  assert.throws(() => giftWrapFee(-1), RangeError);
  assert.throws(() => giftWrapFee(1.5), RangeError);
});
