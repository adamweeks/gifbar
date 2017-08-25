// Sample API Search
// http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=<KEY>
import {getReadableFileSizeString, getGlobalElectronProperty} from './utils';

const baseUrl = `http://api.giphy.com/v1/gifs/`;
const searchEndpoint = `search`;
const trendingEndpoint = `trending`;
const GIPHY_API_KEY = getGlobalElectronProperty(`giphyAPIKey`);

/**
 * Searches the giphy api
 *
 * @param {string} searchText
 * @param {number} offset
 * @param {string} rating
 * @returns {Promise}
 *
 */
export function doGiphySearch(searchText, offset = 0, rating = `r`, limit = 25) {
  let searchUrl = `${baseUrl}${searchEndpoint}?q=${searchText}&api_key=${GIPHY_API_KEY}&offset=${offset}&rating=${rating}&limit=${limit}&sort=relevant`;
  const myRequest = new Request(searchUrl);
  return fetch(myRequest).then((response) => {
    return response.json().then((results) => {
      return {
        gifs: results.data.map(mapResults),
        pagination: results.pagination
      };
    });
  });
}

/**
 * Fetches trending gifs
 * @param {number} offset
 * @param {string} rating
 * @param {number} limit
 */
export function fetchGiphyTrending(offset = 0, rating = `r`, limit = 25) {
  let searchUrl = `${baseUrl}${trendingEndpoint}?api_key=${GIPHY_API_KEY}&offset=${offset}&rating=${rating}&limit=${limit}`;
  const myRequest = new Request(searchUrl);
  return fetch(myRequest).then((response) => {
    return response.json().then((results) => {
      return {
        gifs: results.data.map(mapResults),
        pagination: results.pagination
      };
    });
  });
}

function mapResults(giphyObject) {
  return {
    id: giphyObject.id,
    displayUrl: giphyObject.images.fixed_width.url,
    fullSizedImageUrl: giphyObject.images.original.url,
    fullSizedImageFileSize: getReadableFileSizeString(giphyObject.images.original.size),
    sourceUrl: giphyObject.url,
    imageSizes: {
      fullSize: {
        width: parseInt(giphyObject.images.original.width),
        height: parseInt(giphyObject.images.original.height)
      },
      smallSize: {
        width: parseInt(giphyObject.images.fixed_width.width),
        height: parseInt(giphyObject.images.fixed_width.height)
      }
    }
  };
}