import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCoupon } from '../src/coupon.mjs';

test('a valid code is trimmed and upper-cased', () => {
  assert.equal(normalizeCoupon('save10'), 'SAVE10');
  assert.equal(normalizeCoupon('  save10  '), 'SAVE10');
  assert.equal(normalizeCoupon('\tSpring2026\n'), 'SPRING2026');
  assert.equal(normalizeCoupon('ABCD'), 'ABCD');
  assert.equal(normalizeCoupon('1234'), '1234');
});

test('4 and 12 characters are the length limits, measured after trimming', () => {
  assert.equal(normalizeCoupon('abcd'), 'ABCD');
  assert.equal(normalizeCoupon('abcdefghij12'), 'ABCDEFGHIJ12');
  assert.equal(normalizeCoupon('   abcd   '), 'ABCD');
  assert.equal(normalizeCoupon(' abcdefghij12 '), 'ABCDEFGHIJ12');
  assert.throws(() => normalizeCoupon('abc'), { name: 'RangeError', message: /4 to 12.*got 3/ });
  assert.throws(() => normalizeCoupon('  abc  '), { name: 'RangeError', message: /got 3/ });
  assert.throws(() => normalizeCoupon('abcdefghij123'), { name: 'RangeError', message: /4 to 12.*got 13/ });
  assert.throws(() => normalizeCoupon(''), { name: 'RangeError', message: /got 0/ });
  assert.throws(() => normalizeCoupon('    '), { name: 'RangeError', message: /got 0/ });
});

test('characters other than letters and digits are a RangeError that names the first one', () => {
  assert.throws(() => normalizeCoupon('save 10'), { name: 'RangeError', message: /letters and digits.*" "/ });
  assert.throws(() => normalizeCoupon('save-10'), { name: 'RangeError', message: /letters and digits.*"-"/ });
  assert.throws(() => normalizeCoupon('save_10'), { name: 'RangeError', message: /"_"/ });
  assert.throws(() => normalizeCoupon('café10'), { name: 'RangeError', message: /"é"/ });
  assert.throws(() => normalizeCoupon('straße'), { name: 'RangeError', message: /"ß"/ });
  assert.throws(() => normalizeCoupon('ab😀cd'), { name: 'RangeError', message: /"😀"/ });
  assert.throws(() => normalizeCoupon('a-bc_def'), { name: 'RangeError', message: /found "-"$/ });
});

test('a code that is not a string is a RangeError', () => {
  for (const bad of [undefined, null, 1234, 0, -0, NaN, Infinity, true, ['ABCD'], { code: 'ABCD' }, Symbol('x'), Object.create(null)]) {
    assert.throws(() => normalizeCoupon(bad), { name: 'RangeError', message: /must be a string/ });
  }
  assert.throws(() => normalizeCoupon(), { name: 'RangeError', message: /must be a string/ });
});
