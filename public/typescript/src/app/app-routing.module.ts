import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleViewComponent } from './articles/article-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/articles',
    pathMatch: 'full'
  },
  {
    path: 'articles',
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
