import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDiscount } from '../src/discount.mjs';

test('applyDiscount takes a whole-number percent off', () => {
  assert.equal(applyDiscount(200, 10), 180);
});
