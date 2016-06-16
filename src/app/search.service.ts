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
    totalResults: number = 0;
    currentOffset: number = 0;
    currentSearchText: string;
    resultAmount: number = 25;
    forwardAvailable: boolean = false;
    previousAvailable: boolean = false;

    private _searchResultsObserver: Observer<string[]>;

    constructor(private giphyService: GiphyService) {

    }

    doSearch(searchText: string, offset: number = 0) {
        if (!searchText || searchText.trim() === '') {
            this.searchResults.next([]);
            return Promise.reject(new ResponseError('Please enter a search term.', 'http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif'));
        }
        this.currentSearchText = searchText;
        this.currentOffset = offset;
        this.updateHistory(searchText);

        return this.giphyService.search(searchText, offset)
            .then(giphyData => {
                let results = giphyData.data;
                let pagination = giphyData.pagination;
                this.totalResults = pagination.total_count;

                let paginationResults = this.calcPaginationAvailability(this.totalResults, results.length, offset);
                this.previousAvailable = paginationResults.previousAvailable;
                this.forwardAvailable = paginationResults.forwardAvailable;

                this.searchResults.next(results.map(giphyObject => {
                    let image = new ImageObject(giphyObject.images.fixed_width.url);

                    image.fullSizedImageUrl = giphyObject.images.original.url;
                    image.sourceUrl         = giphyObject.url;
                    image.imageSizes        = {
                        fullSize: {
                            width: parseInt(giphyObject.images.original.width),
                            height: parseInt(giphyObject.images.original.height)
                        }
                    };

                    return image;
                }));

                return results;
            })
            .catch(error => {
                this.searchResults.next([]);
                return error;
            });
    }

    loadNext() {
        this.doSearch(this.currentSearchText, this.currentOffset + this.resultAmount + 1);
    }

    loadPrevious() {
        this.doSearch(this.currentSearchText, this.currentOffset - this.resultAmount - 1);
    }

    updateHistory(searchText: string) {
        this.searches.unshift(searchText);
        if(this.searches.length > 5) {
            this.searches.pop();
        }
        this.searchHistory.next(this.searches);
    }

    calcPaginationAvailability(totalResults: number, currentResultCount: number, offset: number) : PaginationAvailability {
        let result: PaginationAvailability = {
            forwardAvailable: false,
            previousAvailable: false,
        };

        if (currentResultCount + offset < totalResults) {
            result.forwardAvailable = true;
        }

        if (offset > currentResultCount) {
            result.previousAvailable = true;
        }

        return result;
    }

}

interface PaginationAvailability {
    forwardAvailable: boolean;
    previousAvailable: boolean;
}