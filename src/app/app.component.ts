import {SearchResultsComponent} from './searchResults.component';
import { SearchHistoryComponent } from './searchHistory.component';
import { SearchPaginationComponent } from './searchPagination.component';
import {SearchService} from './search.service';
import { ClipboardService } from './clipboard.service';
import { ElectronWindowService } from './electronWindow.service';
import { ElectronIPCService } from './electronIpcRenders.service';
import { GiphyService } from './giphy.service';
import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/Rx'; // load the full rxjs

import {SearchBarComponent} from './searchBar.component';

@Component({
    moduleId: module.id,
    selector: 'app',
    template: `
    <div class="main">
        <search-bar></search-bar>
        <search-results></search-results>
        <search-pagination></search-pagination>
    </div>
    `,
    styles: [
        `.main { display: flex; flex-direction: column }`
    ],
    directives: [SearchBarComponent, SearchResultsComponent, SearchHistoryComponent, SearchPaginationComponent],
    providers: [
      HTTP_PROVIDERS,
      SearchService,
      GiphyService,
      ClipboardService,
      ElectronWindowService,
      ElectronIPCService
    ]
})

export class AppComponent {}
