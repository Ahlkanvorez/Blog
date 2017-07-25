import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// To prevent errors due to missing dependencies after webpack build.
import 'zone.js';
import 'reflect-metadata';

platformBrowserDynamic().bootstrapModule(AppModule);
