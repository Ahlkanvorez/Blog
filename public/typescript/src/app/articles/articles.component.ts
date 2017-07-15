import { Component, OnInit } from '@angular/core';
import { Article } from "./article";
import { ArticleService } from "./article.service";

// TODO: Order articles by stickiness first, then date.
@Component({
  selector: 'articles',
  template: `
  <h1>{{ name }}</h1>
  <ul class="articles">
    <li *ngIf="articles == undefined">
      Loading Articles ...
    </li>
    <li *ngFor="let article of articles"
        [routerLink]="['/articles', article.title]">
      <h2>{{ article.title }}</h2>
      <span>{{ article.category }}</span>
      - By
      <span>{{ article.author.name }}</span>
      - posted on
      <span>{{ article.date | date }}</span>
      <p>{{ article.content.slice(0, article.content.indexOf('.')) }}</p>
    </li>
  </ul>`,
  styles: [`
    .articles {
      margin: 0 0 2em 0;
      list-style-type: none;
    }
    
    .articles li {
      cursor: pointer;
      position: relative;
      left: 0;
      margin: 0.5em;
      padding: 0.3em 2.5em;
      border-radius: 4px;
    }
    
    .articles li:hover {
      color: #607d8b;
      background-color: #dddddd;
      left: 0.1em;
    }
  `],
  providers: [ ArticleService ]
})
export class ArticlesComponent implements OnInit {
  name = 'Articles';

  articles: Article[];

  constructor (private articleService: ArticleService) {

  }

  getArticles (): void {
    // TODO: Use the normal getArticles() method in production.
    this.articleService.getArticlesSlowly()
      .then(articles => this.articles = articles)
      .catch(err => console.error(err));
  }

  ngOnInit () {
    this.getArticles();
  }
}
