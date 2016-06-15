webpackJsonp([1,2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const platform_browser_dynamic_1 = __webpack_require__(439);
	const app_component_1 = __webpack_require__(559);
	platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent)
	    .then(success => console.log(`Bootstrap success`))
	    .catch(error => console.log(error));


/***/ },

/***/ 559:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const searchResults_component_1 = __webpack_require__(560);
	const searchHistory_component_1 = __webpack_require__(568);
	const search_service_1 = __webpack_require__(561);
	const clipboard_service_1 = __webpack_require__(566);
	const electronWindow_service_1 = __webpack_require__(567);
	const giphy_service_1 = __webpack_require__(563);
	const core_1 = __webpack_require__(280);
	const http_1 = __webpack_require__(418);
	__webpack_require__(2);
	const searchBar_component_1 = __webpack_require__(569);
	let AppComponent = class AppComponent {
	};
	AppComponent = __decorate([
	    core_1.Component({
	        moduleId: module.id,
	        selector: 'app',
	        template: `
	        <search-bar></search-bar>
	        <search-results></search-results>
	    `,
	        directives: [searchBar_component_1.SearchBarComponent, searchResults_component_1.SearchResultsComponent, searchHistory_component_1.SearchHistoryComponent],
	        providers: [
	            http_1.HTTP_PROVIDERS,
	            search_service_1.SearchService,
	            giphy_service_1.GiphyService,
	            clipboard_service_1.ClipboardService,
	            electronWindow_service_1.ElectronWindowService
	        ]
	    }), 
	    __metadata('design:paramtypes', [])
	], AppComponent);
	exports.AppComponent = AppComponent;


/***/ },

/***/ 560:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const search_service_1 = __webpack_require__(561);
	const imageDisplay_component_1 = __webpack_require__(565);
	const core_1 = __webpack_require__(280);
	let SearchResultsComponent = class SearchResultsComponent {
	    constructor(searchService) {
	        this.searchService = searchService;
	        this.totalResults = 0;
	    }
	    ngOnInit() {
	        this.results = this.searchService.searchResults;
	        this.totalResults = this.searchService.totalResults;
	    }
	};
	SearchResultsComponent = __decorate([
	    core_1.Component({
	        moduleId: module.id,
	        selector: 'search-results',
	        directives: [imageDisplay_component_1.ImageDisplayComponent],
	        template: `
	    <div *ngFor="let item of results | async">
	        <image-display [image]="item"></image-display>
	    </div>
	    <div>{{ searchService.totalResults }}</div>
	    `,
	        styles: [
	            `
	        image-display {
	            display: block;
	            padding: 5px;
	            float: left;
	        }
	        `
	        ]
	    }), 
	    __metadata('design:paramtypes', [search_service_1.SearchService])
	], SearchResultsComponent);
	exports.SearchResultsComponent = SearchResultsComponent;


/***/ },

/***/ 561:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	const rxjs_1 = __webpack_require__(2);
	const imageObject_class_1 = __webpack_require__(562);
	const giphy_service_1 = __webpack_require__(563);
	const responseError_1 = __webpack_require__(564);
	let SearchService = class SearchService {
	    constructor(giphyService) {
	        this.giphyService = giphyService;
	        this.searchResults = new rxjs_1.Subject();
	        this.searchHistory = new rxjs_1.Subject();
	        this.searches = [];
	        this.totalResults = 0;
	    }
	    doSearch(searchText) {
	        if (!searchText || searchText.trim() === '') {
	            this.searchResults.next([]);
	            return Promise.reject(new responseError_1.ResponseError('Please enter a search term.', 'http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif'));
	        }
	        this.updateHistory(searchText);
	        return this.giphyService.search(searchText)
	            .then(giphyData => {
	            let results = giphyData.data;
	            let pagination = giphyData.pagination;
	            this.totalResults = pagination.total_count;
	            this.searchResults.next(results.map(giphyObject => {
	                let image = new imageObject_class_1.ImageObject(giphyObject.images.fixed_width.url);
	                image.fullSizedImageUrl = giphyObject.images.original.url;
	                image.sourceUrl = giphyObject.url;
	                image.imageSizes = {
	                    fullSize: {
	                        width: parseInt(giphyObject.images.original.width),
	                        height: parseInt(giphyObject.images.original.height)
	                    }
	                };
	                return image;
	            }));
	            return results;
	        })
	            .catch(error => {
	            this.searchResults.next([]);
	            return error;
	        });
	    }
	    updateHistory(searchText) {
	        this.searches.unshift(searchText);
	        if (this.searches.length > 5) {
	            this.searches.pop();
	        }
	        this.searchHistory.next(this.searches);
	    }
	};
	SearchService = __decorate([
	    core_1.Injectable(), 
	    __metadata('design:paramtypes', [giphy_service_1.GiphyService])
	], SearchService);
	exports.SearchService = SearchService;


/***/ },

/***/ 562:
/***/ function(module, exports) {

	"use strict";
	class ImageObject {
	    constructor(displayUrl) {
	        this.displayUrl = displayUrl;
	        this.fullSizedImageUrl = this.displayUrl;
	        this.sourceUrl = this.displayUrl;
	    }
	}
	exports.ImageObject = ImageObject;


/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	const http_1 = __webpack_require__(418);
	let GiphyService = class GiphyService {
	    constructor(http) {
	        this.http = http;
	        this.baseUrl = 'http://api.giphy.com/v1/gifs/';
	        this.searchEndpoint = 'search';
	        this.apiKey = 'dc6zaTOxFJmzC';
	    }
	    search(searchText) {
	        let searchUrl = `${this.baseUrl}${this.searchEndpoint}?q=${searchText}&api_key=${this.apiKey}`;
	        return this.http.get(searchUrl)
	            .toPromise()
	            .then(response => response.json());
	    }
	};
	GiphyService = __decorate([
	    core_1.Injectable(), 
	    __metadata('design:paramtypes', [http_1.Http])
	], GiphyService);
	exports.GiphyService = GiphyService;


/***/ },

/***/ 564:
/***/ function(module, exports) {

	"use strict";
	class ResponseError extends Error {
	    constructor(message, imageUrl) {
	        super(message);
	        this.imageUrl = imageUrl;
	    }
	}
	exports.ResponseError = ResponseError;


/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	const imageObject_class_1 = __webpack_require__(562);
	const clipboard_service_1 = __webpack_require__(566);
	const electronWindow_service_1 = __webpack_require__(567);
	let ImageDisplayComponent = class ImageDisplayComponent {
	    constructor(clipboardService, electronWindowService) {
	        this.clipboardService = clipboardService;
	        this.electronWindowService = electronWindowService;
	    }
	    ngOnInit() { }
	    copyUrl() {
	        this.clipboardService.writeText(`${this.image.fullSizedImageUrl} #gifbar`);
	    }
	    openWindow() {
	        this.electronWindowService.openModal(this.image.fullSizedImageUrl, this.image.imageSizes.fullSize.width, this.image.imageSizes.fullSize.height);
	    }
	};
	__decorate([
	    core_1.Input(), 
	    __metadata('design:type', imageObject_class_1.ImageObject)
	], ImageDisplayComponent.prototype, "image", void 0);
	ImageDisplayComponent = __decorate([
	    core_1.Component({
	        moduleId: module.id,
	        selector: 'image-display',
	        template: `
	        <img [src]="image.displayUrl">
	        <div class="actionItems">
	            <button (click)="copyUrl()">Copy Url</button>
	            <button (click)="openWindow()">View</button>
	        </div>
	    `,
	        styles: [
	            `
	        img {
	            width: 200px;
	            display: block;
	        }
	        button {
	            height: 40px;
	            line-height: 40px;
	        }
	        `
	        ]
	    }), 
	    __metadata('design:paramtypes', [clipboard_service_1.ClipboardService, electronWindow_service_1.ElectronWindowService])
	], ImageDisplayComponent);
	exports.ImageDisplayComponent = ImageDisplayComponent;


/***/ },

/***/ 566:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	let ClipboardService = class ClipboardService {
	    constructor() {
	        this.clipboard = electron.clipboard;
	    }
	    readText() {
	        return this.clipboard.readText();
	    }
	    writeText(text) {
	        return this.clipboard.writeText(text);
	    }
	};
	ClipboardService = __decorate([
	    core_1.Injectable(), 
	    __metadata('design:paramtypes', [])
	], ClipboardService);
	exports.ClipboardService = ClipboardService;


/***/ },

/***/ 567:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	let ElectronWindowService = class ElectronWindowService {
	    constructor() {
	        this.BrowserWindow = electron.remote.BrowserWindow;
	    }
	    openModal(url, width = 200, height = 200) {
	        let webPreferences = {
	            zoomFactor: 1.0
	        };
	        let options = {
	            width: width,
	            height: height,
	            resizable: false,
	            title: "Image",
	            webPreferences: webPreferences
	        };
	        let win = new this.BrowserWindow(options);
	        win.on('closed', () => {
	            win = null;
	        });
	        let fileUrl = `file://${dirname}/modal.html?url=${url}&width=${width}&height=${height}`;
	        win.loadURL(fileUrl);
	        win.show();
	    }
	};
	ElectronWindowService = __decorate([
	    core_1.Injectable(), 
	    __metadata('design:paramtypes', [])
	], ElectronWindowService);
	exports.ElectronWindowService = ElectronWindowService;


/***/ },

/***/ 568:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	const search_service_1 = __webpack_require__(561);
	let SearchHistoryComponent = class SearchHistoryComponent {
	    constructor(searchService) {
	        this.searchService = searchService;
	    }
	    ngOnInit() {
	        this.results = this.searchService.searchHistory;
	    }
	};
	SearchHistoryComponent = __decorate([
	    core_1.Component({
	        moduleId: module.id,
	        selector: 'search-history',
	        template: `
	    <h3>History</h3>
	    <ul>
	        <li *ngFor="let item of results | async">{{item}}</li>
	    <ul>
	    `
	    }), 
	    __metadata('design:paramtypes', [search_service_1.SearchService])
	], SearchHistoryComponent);
	exports.SearchHistoryComponent = SearchHistoryComponent;


/***/ },

/***/ 569:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const core_1 = __webpack_require__(280);
	const search_service_1 = __webpack_require__(561);
	const responseError_1 = __webpack_require__(564);
	let SearchBarComponent = class SearchBarComponent {
	    constructor(searchService) {
	        this.searchService = searchService;
	    }
	    ngOnInit() { }
	    doSearch(searchText) {
	        this.searchError = null;
	        this.searchService.doSearch(searchText)
	            .then((results) => {
	            if (results.length === 0) {
	                this.searchError = new responseError_1.ResponseError('Could not find any gifs for that search term.', 'https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif');
	            }
	        })
	            .catch(error => {
	            this.searchError = error;
	        });
	    }
	};
	SearchBarComponent = __decorate([
	    core_1.Component({
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
	    }), 
	    __metadata('design:paramtypes', [search_service_1.SearchService])
	], SearchBarComponent);
	exports.SearchBarComponent = SearchBarComponent;


/***/ }

});
//# sourceMappingURL=app.js.map