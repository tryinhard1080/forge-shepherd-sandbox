export function total(items) {
  return items.reduce((sum, i) => {
    if (i.qty < 0) throw new RangeError(`qty must not be negative, got ${i.qty}`);
    if (i.price < 0) throw new RangeError(`price must not be negative, got ${i.price}`);
    return sum + i.price * i.qty;
  }, 0);
}
