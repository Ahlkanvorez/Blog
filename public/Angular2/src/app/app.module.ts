import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { NoEncodeUrlSerializer } from "./no-encode-url-serializer";

// For development purposes only.
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent } from "./app.component";
import { AboutComponent } from "./about/about.component";
import { ArticlesComponent } from './articles/articles.component';
import { ArticleViewComponent } from './articles/article-view.component';
import { ArticleService } from "./articles/article.service";
import { ArticleSearchComponent } from './articles/article-search.component';
import { CategoryService } from "./categories/category.service";
import { UrlSerializer } from "@angular/router";

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService) // for development purposes only
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    ArticlesComponent,
    ArticleViewComponent,
    ArticleSearchComponent
  ],
  providers: [ ArticleService, CategoryService, { provide: UrlSerializer, useClass: NoEncodeUrlSerializer } ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
