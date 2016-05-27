import {bootstrap} from '@angular/platform-browser-dynamic';
import {Component} from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app',
  template: `
    <h1>Ready for Electron!</h1>
  `
})

export class App {

  constructor() {}

}

bootstrap(App);