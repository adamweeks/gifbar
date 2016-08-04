import { Component, OnInit, Input } from '@angular/core';
import { ImageObject } from './imageObject.class';
import { ClipboardService } from './clipboard.service';
import { ElectronWindowService } from './electronWindow.service';

@Component({
    moduleId: module.id,
    selector: 'image-display',
    template: `
    <div class="image-container" [style.height.px]="image.imageSizes.smallSize.height" (mouseover)="hidden=false" (mouseleave)="hidden=true">
        <div class="info" *ngIf="!hidden">
            {{ image.fullSizedImageFileSize }}
        </div>
        <div class="action-items" *ngIf="!hidden">
            <button (click)="copyUrl()" title="Click to copy the Url">Copy</button>
        </div>
        <img (click)="openWindow()" [src]="image.displayUrl">
    </div>
    `,
    styles: [
        `
        .image-container {
            display: flex;
            position: relative;
        }
        .action-items {
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 10;
        }
        .info {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 22px;
            line-height: 20px;
            font-size: 20px;
            background-color: white;
            text-align: center;
            font-family: "Helvetica Neue";
            opacity: 0.6;
            padding: 0 5px;
            z-index: 10;

        }
        img {
            width: 200px;
            display: block;
            z-index: 9;
        }
        button {
            height: 40px;
            line-height: 40px;
            opacity: 0.6;
        }
        `
    ]
})
export class ImageDisplayComponent implements OnInit {

    @Input() image: ImageObject;

    public hidden: boolean = true;

    constructor(private clipboardService: ClipboardService, private electronWindowService: ElectronWindowService) { }

    ngOnInit() { }

    copyUrl() {
        this.clipboardService.writeText(`${this.image.fullSizedImageUrl} #gifbar`);
        this.electronWindowService.hideCurrentWindow();
    }

    openWindow() {
        this.electronWindowService.openModal(
            this.image.fullSizedImageUrl,
            this.image.imageSizes.fullSize.width,
            this.image.imageSizes.fullSize.height
        );
    }
}
