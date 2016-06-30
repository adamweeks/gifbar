import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Control } from '@angular/common';
import {SearchService} from './search.service';
import { ResponseError } from './responseError';
import { ElectronIPCService } from './electronIpcRenders.service';

@Component({
    moduleId: module.id,
    selector: 'search-bar',
    template: `
    <form (ngSubmit)="doSearch(searchText)" #searchBarForm="ngForm">
        <input #searchBar id="searchBar" [ngFormControl]="searchControl" [(ngModel)]="searchText" placeholder="Search for gifs">
        <button type="button" (click)="cancelSearch()" class="cancel">X</button>
    </form>
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
    searchControl = new Control();
    @ViewChild('searchBar') searchBar: ElementRef;

    constructor(
        private searchService: SearchService,
        private electronIPCService: ElectronIPCService,
        private renderer: Renderer
    ) {
        // Sets up the observable control to pass to service
        searchService.liveSearch(this.searchControl.valueChanges);
    }

    ngOnInit() {
        this.electronIPCService.on('after-show', () => {
            this.focusSearch();
        });
     }

    doSearch(searchText) {
        this.searchError = null;
        this.searchService.doSearch(searchText);
    }

    cancelSearch() {
        this.searchText = '';
        this.searchError = null;
        this.searchService.cancelSearch();
    }

    focusSearch() {
        this.renderer.invokeElementMethod(this.searchBar.nativeElement, 'focus', []);
    }
}
