import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// To prevent errors due to missing dependencies after webpack build.
import 'zone.js';
import 'reflect-metadata';
import { enableProdMode } from "@angular/core";
import './twitter.js';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
