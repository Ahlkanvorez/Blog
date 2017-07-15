import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ArticleViewComponent } from './article-view.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
    AppComponent,
    ArticleViewComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
