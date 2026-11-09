// Returns a new cart array without the first item named `name`.
// Throws RangeError when no item has that name. The input array is not modified.
export function deleteItem(items, name) {
  const index = items.findIndex(item => item.name === name);
  if (index === -1) throw new RangeError(`no item named ${JSON.stringify(name)} in the cart`);
  return [...items.slice(0, index), ...items.slice(index + 1)];
}
