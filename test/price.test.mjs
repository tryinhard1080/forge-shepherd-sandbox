import { test } from 'node:test';
import assert from 'node:assert/strict';
import { total } from '../src/price.mjs';

test.skip('total sums price times quantity', () => {
  assert.equal(total([{ price: 2, qty: 3 }, { price: 5, qty: 1 }]), 11);
});
