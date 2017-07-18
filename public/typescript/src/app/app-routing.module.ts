import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleViewComponent } from './articles/article-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/article-list',
    pathMatch: 'full'
  },
  {
    path: 'article-list',
    component: ArticlesComponent
  },
  {
    path: 'article-list/:category',
    component: ArticlesComponent
  },
  {
    path: 'articles/:title',
    component: ArticleViewComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
