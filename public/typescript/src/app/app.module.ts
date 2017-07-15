import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleViewComponent } from './articles/article-view.component';
import { AppComponent } from "./app.component";
import { ArticleService } from "./articles/article.service";
import { AboutComponent } from "./about/about.component";


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ArticlesComponent,
    ArticleViewComponent,
    AboutComponent
  ],
  providers: [
    ArticleService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
