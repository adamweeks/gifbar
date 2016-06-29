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
    <div *ngIf="searchService.searchError">
        <p>{{searchService.searchError.message}}</p>
        <p *ngIf="searchService.searchError.imageUrl"><img [src]="searchService.searchError.imageUrl"></p>
    </div>
    <div *ngFor="let item of searchService.searchResults | async">
        <image-display [image]="item"></image-display>
    </div>
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
    constructor(private searchService: SearchService) { }

    ngOnInit() {}

}