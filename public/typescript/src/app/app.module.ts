import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

// For development purposes only.
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleViewComponent } from './articles/article-view.component';
import { AppComponent } from "./app.component";
import { ArticleService } from "./articles/article.service";
import { AboutComponent } from "./about/about.component";


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,

    InMemoryWebApiModule.forRoot(InMemoryDataService)
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
