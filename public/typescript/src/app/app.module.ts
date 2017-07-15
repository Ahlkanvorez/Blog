import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ArticlesComponent } from './articles/articles.component';
import { ArticleViewComponent } from './articles/article-view.component';
import { AppComponent } from "./app.component";
import { ArticleService } from "./articles/article.service";

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
    AppComponent,
    ArticlesComponent,
    ArticleViewComponent
  ],
  providers: [
    ArticleService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
