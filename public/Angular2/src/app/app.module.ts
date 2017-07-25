import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

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
  providers: [ ArticleService, CategoryService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
