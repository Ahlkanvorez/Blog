import { Component } from '@angular/core';
import { Article, articles } from "./article";

// TODO: Order articles by stickiness first, then date.
@Component({
  selector: 'blog',
  template: `
  <h1>{{ name }}</h1>
  <ul class="articles">
    <li *ngFor="let article of articles"
        (click)="onSelect(article)"
        [class.selected]="article==selectedArticle">
      <h2>{{ article.title }}</h2>
      <a>{{ article.category }}</a>
      - By
      <a>{{ article.author.name }}</a>
      - posted on
      <span>{{ article.date | date }}</span>
      <p>{{ article.content.slice(0, article.content.indexOf('.')) }}</p>
    </li>
  </ul>
  <article-view [article]="selectedArticle"></article-view>`,
  styles: [`
    .selected {
      background-color: #cfd8dc !important;
      color: white;
    }
    
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
    
    .articles li.selected:hover {
      background-color: #bbd8dc !important;
      color: white;
    }
    
    .articles li:hover {
      color: #607d8b;
      background-color: #dddddd;
      left: 0.1em;
    }
    
    .articles .text {
      position: relative;
      top: -3px;
    }
  `]
})
export class AppComponent {
  name = 'Blog';
  articles = articles;
  selectedArticle: Article;

  onSelect(article: Article): void {
    this.selectedArticle = article;
  }
}
