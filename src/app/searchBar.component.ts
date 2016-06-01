import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    template: `<input id="searchBar" [(ngModel)]="searchText"><button (click)="doSearch(searchText)">Search</button>`
})
export class SearchBarComponent implements OnInit {
    constructor(private searchService: SearchService) { }

    ngOnInit() { }

    doSearch(searchText) {
        this.searchService.doSearch(searchText);
    }

}