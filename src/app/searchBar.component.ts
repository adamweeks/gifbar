import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';

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
    constructor(private searchService: SearchService) { }

    ngOnInit() { }

    doSearch(searchText) {
        this.searchService.doSearch(searchText);
    }

}