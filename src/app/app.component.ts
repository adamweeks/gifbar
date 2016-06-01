import {SearchResultsComponent} from './searchResults.component';
import {SearchService} from './search.service';
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx'; // load the full rxjs

import {SearchBarComponent} from './searchBar.component';

@Component({
    moduleId: module.id,
    selector: 'app',
    template: `
        <h1>Ready for Electron!!</h1>
        <search-bar></search-bar>
        <search-results></search-results>
    `,
    directives: [SearchBarComponent, SearchResultsComponent],
    providers: [
      HTTP_PROVIDERS,
      SearchService
    ]
})

export class AppComponent {}
