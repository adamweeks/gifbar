import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'search-history',
    template: `
    <h3>History</h3>
    <ul>
        <li *ngFor="let item of results | async">{{item}}</li>
    <ul>
    `
})
export class SearchHistoryComponent implements OnInit {
    results: Observable<any>;
    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.results = this.searchService.searchHistory;
    }

}