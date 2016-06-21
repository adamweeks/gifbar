import { Injectable } from '@angular/core';

// `electron` var is declared publicly in index.html
declare var electron:any;

@Injectable()
export class ElectronIPCService {
    ipcRenderer = electron.ipcRenderer;
    constructor() { }

    on(channel: string, listener) {
        this.ipcRenderer.on(channel, listener);
    }

    removeListener(channel:string, listener) {

    }
}
