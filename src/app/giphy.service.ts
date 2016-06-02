import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GiphyService {

    baseUrl:string = 'http://api.giphy.com/v1/gifs/';
    searchEndpoint: string = 'search';
    apiKey: string = 'dc6zaTOxFJmzC';

    constructor(private http: Http) { }

    search(searchText: string) {
        let searchUrl = `${this.baseUrl}${this.searchEndpoint}?q=${searchText}&api_key=${this.apiKey}`;
        return this.http.get(searchUrl)
               .toPromise()
               .then(response => response.json().data);
    }

}