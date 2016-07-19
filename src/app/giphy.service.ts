import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GiphyService {

    // Sample API Search
    // http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC

    baseUrl:string = 'http://api.giphy.com/v1/gifs/';
    searchEndpoint: string = 'search';
    apiKey: string = 'dc6zaTOxFJmzC';

    constructor(private http: Http) { }

    search(searchText: string, offset: number = 0): Observable<Giphy.GiphyResponse> {
        let searchUrl = `${this.baseUrl}${this.searchEndpoint}?q=${searchText}&api_key=${this.apiKey}&offset=${offset}&rating=r`;
        return this.http.get(searchUrl)
               .map((res:Response) => res.json());
    }

}



