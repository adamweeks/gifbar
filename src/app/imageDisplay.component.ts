import { Component, OnInit, Input } from '@angular/core';
import { ImageObject } from './imageObject.class';
import { ClipboardService } from './clipboard.service';

@Component({
    moduleId: module.id,
    selector: 'image-display',
    template: `
        <img [src]="image.displayUrl">
        <input readonly [value]="image.fullSizedImageUrl">
        <button (click)="copyUrl()">Copy</button>
    `,
    styles: [
        `
        img {
            width: 200px;
            display: block;
        }
        `
    ]
})
export class ImageDisplayComponent implements OnInit {

    @Input() image: ImageObject;

    constructor(private clipboardService: ClipboardService) { }

    ngOnInit() { }

    copyUrl() {
        this.clipboardService.writeText(this.image.fullSizedImageUrl);
    }
}