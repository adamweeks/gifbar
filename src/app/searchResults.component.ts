import {SearchService} from './search.service';
import { ImageDisplayComponent } from './imageDisplay.component';
import { ImageObject } from './imageObject.class';
import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'search-results',
    directives: [ImageDisplayComponent],
    template: `
    <div *ngIf="searchService.searchError">
        <p>{{searchService.searchError.message}}</p>
        <p *ngIf="searchService.searchError.imageUrl"><img [src]="searchService.searchError.imageUrl"></p>
    </div>
    <div class="image-grid">
        <div class="col">
            <image-display [image]="item" *ngFor="let item of searchResultsLeft | async" >
            </image-display>
        </div>
        <div class="col">
            <image-display [image]="item" *ngFor="let item of searchResultsRight | async" >
            </image-display>
        </div>
    </div>
    `,
    styles: [
        `
        .image-grid {
            display: flex;
            flex-direction: row;
        }
        .col {
            display: flex;
            flex-direction: column;
        }
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

    public searchResultsLeft: Subject<ImageObject[]> = new Subject<ImageObject[]>();
    public searchResultsRight: Subject<ImageObject[]> = new Subject<ImageObject[]>();

    ngOnInit() {
        this.searchService.searchResults.subscribe((results) => {
            let left = [], right = [];
            let leftHeight:number = 0, rightHeight:number = 0;
            let currentSide = 0;
            results.forEach((result, index) => {
                currentSide = 0;
                if (leftHeight > rightHeight) {
                    currentSide = 1;
                }
                if (currentSide) {
                    right.push(result);
                    rightHeight += result.imageSizes.smallSize.height;
                }
                else {
                    left.push(result);
                    leftHeight += result.imageSizes.smallSize.height;
                }
            });
            this.searchResultsLeft.next(left);
            this.searchResultsRight.next(right);
        });
    }

}