import {SearchService} from './search.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'search-results',
    template: `
    <h3>Results</h3>
    <ul>
        <li *ngFor="let item of results | async">{{item}}</li>
    <ul>
    `
})
export class SearchResultsComponent implements OnInit {
    results: Observable<any>;
    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.results = this.searchService.searchResults;
    }

}