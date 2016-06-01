import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app.component';

// enableProdMode();

bootstrap(AppComponent)
  .then(success => console.log(`Bootstrap success`))
  .catch(error => console.log(error));
