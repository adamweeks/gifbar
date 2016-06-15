import {SearchService} from './search.service';
import { ImageDisplayComponent } from './imageDisplay.component';
import { ImageObject } from './imageObject.class';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'search-results',
    directives: [ImageDisplayComponent],
    template: `
    <div *ngFor="let item of results | async">
        <image-display [image]="item"></image-display>
    </div>
    <div>{{ searchService.totalResults }}</div>
    `,
    styles: [
        `
        image-display {
            display: block;
            padding: 5px;
            float: left;
        }
        `
    ]
})
export class SearchResultsComponent implements OnInit {
    results: Observable<ImageObject[]>;
    totalResults: number = 0;
    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.results = this.searchService.searchResults;
        this.totalResults = this.searchService.totalResults;
    }

}