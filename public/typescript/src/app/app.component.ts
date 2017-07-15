import { Component } from '@angular/core';

export class Article {
  _id: number;
  title: string;
  author: { name: string; email: string; };
  date: Date;
  category: string;
  content: string;
  sticky: boolean;
  image: string;
  image_dimensions: { width: number, height: number };
}

export const articles: Article[] = [
  {
    _id: 1,
    title: 'test1',
    author: { name: 'robert', email: 'a@b.c' },
    date: new Date(),
    category: 'test',
    content: 'this is a test article.  This sentence should only display on click. Same goes for this one.',
    sticky: false,
    image: '',
    image_dimensions: { width: 0, height: 0 }
  },
  {
    _id: 2,
    title: 'test2',
    author: { name: 'mitchell', email: 'a@b.c' },
    date: new Date(),
    category: 'test',
    content: 'this is another test article. This sentence should only display on click.',
    sticky: true,
    image: '',
    image_dimensions: { width: 0, height: 0 }
  }
];
//  | orderBy:['-sticky', '-date']
// | date

@Component({
  selector: 'blog',
  template: `
  <h1>{{ name }}</h1>
  <ul class="articles">
    <li *ngFor="let article of articles" (click)="onSelect(article)">
      <h2>{{ article.title }}</h2>
      <a>{{ article.category }}</a>
      - By
      <a>{{ article.author.name }}</a>
      - posted on
      <span>{{ article.date | date }}</span>
      <p>{{ article.content.slice(0, article.content.indexOf('.')) }}</p>
    </li>
  </ul>
  <div *ngIf="selectedArticle">
    <h1>{{ selectedArticle.title }}</h1>
    <a>{{ selectedArticle.category }}</a>
    - By
    <a>{{ selectedArticle.author.name }}</a>
    - posted on
    <span>{{ selectedArticle.date | date }}</span>
    <p>{{ selectedArticle.content }}</p>
  </div>`,
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
