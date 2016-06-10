import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject, Observer } from 'rxjs';

import { ImageObject } from './imageObject.class';
import { GiphyService } from './giphy.service';
import { ResponseError } from './responseError';

@Injectable()
export class SearchService {
    searchResults: Subject<ImageObject[]> = new Subject<ImageObject[]>();
    searchHistory: Subject<string[]> = new Subject<string[]>();
    searches: string[] = [];

    private _searchResultsObserver: Observer<string[]>;

    constructor(private giphyService: GiphyService) {

    }

    doSearch(searchText: string) {
        if (!searchText || searchText.trim() === '') {
            this.searchResults.next([]);
            return Promise.reject(new ResponseError('Please enter a search term.', 'http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif'));
        }

        this.updateHistory(searchText);
        this.giphyService.search(searchText)
            .then(results => {
            this.searchResults.next(results.map(giphyObject => {
                let image = new ImageObject(giphyObject.images.fixed_width.url);
                image.fullSizedImageUrl = giphyObject.images.original.url;
                image.sourceUrl = giphyObject.url;
                image.imageSizes = {
                    fullSize: {
                        width: parseInt(giphyObject.images.original.width),
                        height: parseInt(giphyObject.images.original.height)
                    }
                };
                return image;
            }));
        });
    }

    updateHistory(searchText: string) {
        this.searches.unshift(searchText);
        if(this.searches.length > 5) {
            this.searches.pop();
        }
        this.searchHistory.next(this.searches);
    }

}
