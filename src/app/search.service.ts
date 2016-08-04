import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject, Observer } from 'rxjs';

import { ImageObject } from './imageObject.class';
import { GiphyService } from './giphy.service';
import { ResponseError } from './responseError';
import { ElectronWindowService } from './electronWindow.service';

@Injectable()
export class SearchService {
    searchResults: Subject<ImageObject[]> = new Subject<ImageObject[]>();
    searchHistory: Subject<string[]> = new Subject<string[]>();
    searches: string[] = [];
    searchError: ResponseError;
    totalResults: number = 0;
    currentOffset: number = 0;
    currentSearch: Subject<string> = new Subject<string>();
    currentSearchText: string;
    resultAmount: number = 25;
    forwardAvailable: boolean = false;
    previousAvailable: boolean = false;

    private _searchResultsObserver: Observer<string[]>;

    constructor(private giphyService: GiphyService, private electronWindowService:ElectronWindowService) {
        this.searchResults.next([]);
    }

    liveSearch(searchString: Observable<string>, debounceDuration = 1500) {
        searchString
            .debounceTime(debounceDuration)
            .distinctUntilChanged()
            .subscribe(searchText => {
                if (searchText) {
                    this.doSearch(searchText, 0);
                }
            });
    }

    doSearch(searchText: string, offset: number = 0) : Observable<any> {
        this.searchError = null;
        if (!searchText || searchText.trim() === '') {
            this.resetSearch();
            let error = new ResponseError('Please enter a search term.', 'http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif');
            this.searchError = error;
            return Observable.throw(error);
        }
        this.currentSearchText = searchText;
        this.currentOffset = offset;
        this.updateHistory(searchText);

        this.currentSearch.next(searchText);

        let rating = this.electronWindowService.getGlobal('hideNSFW') ? 'g' : 'r';
        
        this.giphyService.search(searchText, offset, rating)
            .subscribe(
                giphyData => {
                    let results = giphyData.data;
                    let pagination = giphyData.pagination;
                    this.totalResults = pagination.total_count;

                    let paginationResults = this.calcPaginationAvailability(this.totalResults, results.length, offset);
                    this.previousAvailable = paginationResults.previousAvailable;
                    this.forwardAvailable = paginationResults.forwardAvailable;

                    if (results.length === 0) {
                        this.searchError = new ResponseError('Could not find any gifs for that search term.', 'https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif');
                    }
                    this.searchResults.next(results.map(giphyObject => {
                        let image = new ImageObject(giphyObject.images.fixed_width.url);

                        image.fullSizedImageUrl = giphyObject.images.original.url;
                        image.fullSizedImageFileSize = this.getReadableFileSizeString(giphyObject.images.original.size);
                        image.sourceUrl         = giphyObject.url;
                        image.imageSizes        = {
                            fullSize: {
                                width: parseInt(giphyObject.images.original.width),
                                height: parseInt(giphyObject.images.original.height)
                            },
                            smallSize: {
                                width: parseInt(giphyObject.images.fixed_width.width),
                                height: parseInt(giphyObject.images.fixed_width.height)
                            }
                        };

                        return image;
                    }));
                },
                err => {
                    this.searchError = new ResponseError('Something went wrong.', 'https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif');
                    this.searchResults.next([]);
                }
            );
    }

    loadNext() {
        this.doSearch(this.currentSearchText, this.currentOffset + this.resultAmount + 1);
    }

    loadPrevious() {
        this.doSearch(this.currentSearchText, this.currentOffset - this.resultAmount - 1);
    }

    cancelSearch() {
        this.resetSearch();
    }

    resetSearch() {
        this.currentSearchText = null;
        this.currentOffset = 0;
        this.totalResults = 0;
        this.previousAvailable = false;
        this.forwardAvailable = false;
        this.searchResults.next([]);
        this.searchError = null;
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

    getReadableFileSizeString(fileSize:string):string {
        let fileSizeInBytes:number = parseInt(fileSize);
        let i = -1;
        const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1).toString() + byteUnits[i];
    }

}

interface PaginationAvailability {
    forwardAvailable: boolean;
    previousAvailable: boolean;
}