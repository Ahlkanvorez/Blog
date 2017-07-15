import { Injectable } from '@angular/core';
import { Article } from "./article";

const articles: Article[] = [
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

@Injectable()
export class ArticleService {
  getArticles (): Promise<Article[]> {
    return Promise.resolve(articles);
  }
}
