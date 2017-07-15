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

  getArticle (title: string): Promise<Article> {
    return this.getArticles()
      .then(articles => articles.find(article => article.title === title))
      .catch(err => console.error(err));
  }

  // TODO: Ensure this is never called, and is not provided, in production.
  getArticlesSlowly (): Promise<Article[]> {
    // Simulate 2s of server latency.
    return new Promise(resolve => {
      setTimeout(() => resolve(this.getArticles()), 2000);
    });
  }
}
