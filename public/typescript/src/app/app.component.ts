import { Component } from '@angular/core';

@Component({
  selector: 'blog',
  template: `
  <h1>{{ title }}</h1>
  <nav>
    <a routerLink="/about">About</a>
    <a routerLink="/articles">Articles</a>
  </nav>
  <router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'Blog';
}
