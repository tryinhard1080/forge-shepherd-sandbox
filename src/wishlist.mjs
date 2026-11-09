// A wishlist is an array of items, each with a unique name (compared exactly,
// case-sensitive). Both functions return a new list and never change the one
// passed in.

// Returns list with item appended. Throws RangeError if an item with the
// same name is already on the list.
export function addToWishlist(list, item) {
  if (list.some(i => i.name === item.name)) {
    throw new RangeError(`"${item.name}" is already on the wishlist`);
  }
  return [...list, item];
}

// Returns list without the item named name. Throws RangeError if no item on
// the list has that name.
export function removeFromWishlist(list, name) {
  if (!list.some(i => i.name === name)) {
    throw new RangeError(`"${name}" is not on the wishlist`);
  }
  return list.filter(i => i.name !== name);
}
