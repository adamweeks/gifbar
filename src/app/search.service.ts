import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject, Observer } from 'rxjs';

@Injectable()
export class SearchService {
    searchResults: Subject<string[]> = new Subject<string[]>();
    searchHistory: Subject<string[]> = new Subject<string[]>();
    searches: string[] = [];

    private _searchResultsObserver: Observer<string[]>;

    constructor() {

     }

    doSearch(searchText: string) {
        this.updateHistory(searchText);
    }

    updateHistory(searchText: string) {
        this.searches.unshift(searchText);
        if(this.searches.length > 5) {
            this.searches.pop();
        }
        this.searchHistory.next(this.searches);
    }

}
