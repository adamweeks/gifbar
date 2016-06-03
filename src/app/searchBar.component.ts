import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    template: `
    <form (ngSubmit)="doSearch(searchText)" #searchBarForm="ngForm">
        <input id="searchBar" [(ngModel)]="searchText" placeholder="Search for gifs">
        <button type="submit">Search</button>
    </form>
    `
})
export class SearchBarComponent implements OnInit {
    constructor(private searchService: SearchService) { }

    ngOnInit() { }

    doSearch(searchText) {
        this.searchService.doSearch(searchText);
    }

}