import { Component, OnInit, Input } from '@angular/core';
import { ImageObject } from './imageObject.class';
import { ClipboardService } from './clipboard.service';
import { ElectronWindowService } from './electronWindow.service';

@Component({
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
})
export class ImageDisplayComponent implements OnInit {

    @Input() image: ImageObject;

    constructor(private clipboardService: ClipboardService, private electronWindowService: ElectronWindowService) { }

    ngOnInit() { }

    copyUrl() {
        this.clipboardService.writeText(`${this.image.fullSizedImageUrl} #gifbar`);
    }

    openWindow() {
        this.electronWindowService.openModal(
            this.image.fullSizedImageUrl,
            this.image.imageSizes.fullSize.width,
            this.image.imageSizes.fullSize.height
        );
    }
}
