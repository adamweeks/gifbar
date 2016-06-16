import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';
import { ResponseError } from './responseError';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    template: `
    <form (ngSubmit)="doSearch(searchText)" #searchBarForm="ngForm">
        <input id="searchBar" [(ngModel)]="searchText" placeholder="Search for gifs">
        <button type="button" (click)="cancelSearch()" class="cancel">X</button>
    </form>
    <div *ngIf="searchError">
        <p>{{searchError.message}}</p>
        <p *ngIf="searchError.imageUrl"><img [src]="searchError.imageUrl"></p>
    </div>
    `,
    styles: [
        `
        form {
            display: flex;
            justify-content: space-between;
        }
        button {
            flex: none;
            padding: 6px 8px;
            margin-top: 1px;
            font-size: 14px;
        }
        input {
            flex: 1;
            padding: 5px;
            margin-right: 5px;
            font-size: 14px;
        }`
    ],
})
export class SearchBarComponent implements OnInit {
    searchError: ResponseError;
    searchText: string;
    constructor(private searchService: SearchService) { }

    ngOnInit() { }

    doSearch(searchText) {
        this.searchError = null;
        this.searchService.doSearch(searchText)
            .then((results: any) => {
                if (results.length === 0) {
                    this.searchError = new ResponseError('Could not find any gifs for that search term.', 'https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif');
                }
            })
            .catch(error => {
                this.searchError = error;
            });
    }

    cancelSearch() {
        this.searchText = '';
        this.searchError = null;
        this.searchService.cancelSearch();
    }
}
