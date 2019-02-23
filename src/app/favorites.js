import storage from "electron-json-storage";

let favorites = [];

storage.get(`favorites`, (error, data) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(`Unable to load favorites: ${error}`);
    return;
  }
  if (Array.isArray(data.items)) {
    favorites = data.items;
  }
});

export function storeFavorite(image) {
  favorites.push(image);
  saveFavorites();
}

export function getFavorites(amount=20, offset=0) {
  return {
    favorites: favorites.slice(offset, offset+amount),
    totalCount: favorites.length,
  };
}

export function removeFavorite(image) {
  favorites.splice(favorites.findIndex((favImage) => favImage.id === image.id), 1);
  saveFavorites();
}

function saveFavorites() {
  storage.set(`favorites`, {items: favorites});
}
