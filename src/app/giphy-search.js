// Sample API Search
// http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC

const baseUrl = 'http://api.giphy.com/v1/gifs/';
const searchEndpoint = 'search';

export default class GiphySearch {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Searches the giphy api
     *
     * @param {string} searchText
     * @param {number} offset
     * @param {string} rating
     * @returns {Promise}
     *
     * @memberOf GiphySearch
     */
    doSearch(searchText, offset = 0, rating = 'r', limit = 25) {
        let searchUrl = `${baseUrl}${searchEndpoint}?q=${searchText}&api_key=${this.apiKey}&offset=${offset}&rating=${rating}&limit=${limit}`;
        const myRequest = new Request(searchUrl);
        return fetch(myRequest).then((response) => response.json());
    }
}
