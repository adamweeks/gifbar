import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject, Observer } from 'rxjs';

import { ImageObject } from './imageObject.class';
import { GiphyService } from './giphy.service';

@Injectable()
export class SearchService {
    searchResults: Subject<ImageObject[]> = new Subject<ImageObject[]>();
    searchHistory: Subject<string[]> = new Subject<string[]>();
    searches: string[] = [];



    private _searchResultsObserver: Observer<string[]>;

    constructor(private giphyService: GiphyService) {

     }

    doSearch(searchText: string) {
        this.updateHistory(searchText);
        let fakeResults = [
            new ImageObject('https://media.giphy.com/media/xT4uQ7oPblpi3qz4w8/giphy.gif'),
            new ImageObject('https://media.giphy.com/media/xTiQyDaDthYE21P8Uo/giphy.gif'),
            new ImageObject('https://media.giphy.com/media/l3UcjQCnrQQLUfD0Y/giphy.gif')
        ];
        this.giphyService.search(searchText)
            .then(results => {
            this.searchResults.next(results.map(giphyObject => {
                let image = new ImageObject(giphyObject.images.fixed_width.url);
                image.fullSizedImageUrl = giphyObject.images.original.url;
                image.sourceUrl = giphyObject.url;

                return image;
            }));
        });
        // this.searchResults.next(fakeResults);
    }

    updateHistory(searchText: string) {
        this.searches.unshift(searchText);
        if(this.searches.length > 5) {
            this.searches.pop();
        }
        this.searchHistory.next(this.searches);
    }

}
