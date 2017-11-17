// TODO: load favorites from storage
export const favorites = [];

export function storeFavorite(image) {
  favorites.push(image);
}

export function getFavorites(amount=20, offset=0) {
  return favorites.slice(offset, offset+amount);
}
