import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject, Observer } from 'rxjs';

@Injectable()
export class SearchService {
    searchResults: Subject<string[]> = new Subject<string[]>();
    searches: string[] = [];

    private _searchResultsObserver: Observer<string[]>;

    constructor() {

     }

    doSearch(searchText: string) {
        if(this.searches.length > 5) {
            this.searches.shift();
        }
        this.searches.push(searchText);
        this.searchResults.next(this.searches);
    }

}
