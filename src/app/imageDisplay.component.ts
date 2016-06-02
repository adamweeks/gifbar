import { Component, OnInit, Input } from '@angular/core';
import { ImageObject } from './imageObject.class';

@Component({
    moduleId: module.id,
    selector: 'image-display',
    template: `
        <img [src]="image.url">
        <input readonly [value]="image.url">
    `,
    styles: [
        `
        img {
            width: 200px;
            height: 200px;
            display: block;
        }
        `
    ]
})
export class ImageDisplayComponent implements OnInit {

    @Input() image: ImageObject;

    constructor() { }

    ngOnInit() { }

}