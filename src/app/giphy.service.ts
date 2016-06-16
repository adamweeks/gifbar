import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GiphyService {

    // Sample API Search
    // http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC

    baseUrl:string = 'http://api.giphy.com/v1/gifs/';
    searchEndpoint: string = 'search';
    apiKey: string = 'dc6zaTOxFJmzC';

    constructor(private http: Http) { }

    search(searchText: string, offset: number = 0) {
        let searchUrl = `${this.baseUrl}${this.searchEndpoint}?q=${searchText}&api_key=${this.apiKey}&offset=${offset}`;
        return this.http.get(searchUrl)
               .toPromise()
               .then(response => response.json());
    }

}
