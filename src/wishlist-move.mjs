import { removeFromWishlist } from './wishlist.mjs';

// Moves the wishlist item named name into the cart. Returns { list, cart } as
// new arrays: list without the item, cart with it appended as its own line
// (the cart may already hold a line of that name; nothing is merged). Throws
// RangeError from removeFromWishlist when the name is not on the wishlist.
export function moveToCart(list, cart, name) {
  const remaining = removeFromWishlist(list, name);
  const item = list.find(i => i.name === name);
  return { list: remaining, cart: [...cart, item] };
}
