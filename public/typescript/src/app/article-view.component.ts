import { Component, Input } from '@angular/core';
import { Article } from "./article";

@Component({
  selector: 'article-view',
  template: `
  <div *ngIf="article">
    <h1>{{ article.title }}</h1>
    <a>{{ article.category }}</a>
    - By
    <a>{{ article.author.name }}</a>
    - posted on
    <span>{{ article.date | date }}</span>
    <p>{{ article.content }}</p>
  </div>`
})
export class ArticleViewComponent {
  @Input() article: Article;
}
