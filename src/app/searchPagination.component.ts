import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';

@Component({
    moduleId: module.id,
    selector: 'search-pagination',
    template: `
    <div id="pagination">
        <div class="container">
            <div class="item"><button (click)="previousResults()" [disabled]="!searchService.previousAvailable">Prev</button></div>
            <div class="item"><button (click)="nextResults()" [disabled]="!searchService.forwardAvailable">Next</button></div>
            <div class="item">Results: {{ searchService.totalResults }}</div>
        </div>
    </div>
    `,
    styles: [
        `
        button {
            min-width: 44px;
            min-height: 44px;
            padding: 6px 8px;
            margin-top: 1px;
            font-size: 14px;
        }
        #pagination {
            background-color: lightseagreen;
            min-height: 44px;
        }
        .container {
            display: flex;
            flex-direction: row;
            flex: 100;
            flex-wrap: nowrap;
            margin: 0;
            padding: 0;
            justify-content: space-around;
            align-items: center;
            min-height: 44px;
        }
        .item {
            min-width: 44px;
        }
        `
    ]
})
export class SearchPaginationComponent implements OnInit {
    constructor(private searchService: SearchService) { }

    ngOnInit() { }

    previousResults() {
        this.searchService.loadPrevious();
    }

    nextResults() {
        this.searchService.loadNext();
    }
}