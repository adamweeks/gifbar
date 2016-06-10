import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';
import { ResponseError } from './responseError';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    template: `
    <form (ngSubmit)="doSearch(searchText)" #searchBarForm="ngForm">
        <div class="input-wrapper">
            <input id="searchBar" [(ngModel)]="searchText" placeholder="Search for gifs">
        </div>
        <button type="submit">Search</button>
    </form>
    <div *ngIf="searchError">
        <p>{{searchError.message}}</p>
        <p *ngIf="searchError.imageUrl"><img [src]="searchError.imageUrl"></p>
    </div>
    `,
    styles: [
        '.input-wrapper { margin-right: 72px; }',
        `button {
            padding: 6px 8px;
            margin-top: 1px;
            font-size: 14px;
        }`,
        `input {
            float: left;
            width: 100%;
            padding: 5px;
            margin-right: 5px;
            font-size: 14px;
        }`
    ],
})
export class SearchBarComponent implements OnInit {
    searchError: ResponseError;

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
}
