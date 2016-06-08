import { Injectable } from '@angular/core';

// `electron` var is declared publicly in index.html
declare var electron:any;

@Injectable()

export class ClipboardService {

    clipboard = electron.clipboard;

    constructor() { }


    /**
     * Returns the content in the clipboard as plain text.
     *
     * @returns {string}
     */
    readText():string {
        return this.clipboard.readText();
    }

    /**
     * Writes the text into the clipboard as plain text.
     *
     * @param {string} text
     */
    writeText(text:string) {
        return this.clipboard.writeText(text);
    }

}