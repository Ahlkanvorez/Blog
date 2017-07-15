import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Article } from "./article";

const articlesUrl = 'api/articles';

@Injectable()
export class ArticleService {

  constructor (private http: Http) {}

  getArticles (): Promise<Article[]> {
    return this.http.get(articlesUrl).toPromise()
      .then(res => res.json().data as Article[])
      .catch(this.handleError);
  }

  getArticle (title: string): Promise<Article> {
    return this.http.get(`${articlesUrl}/${title}`).toPromise()
      .then(res => res.json().data as Article)
      .catch(this.handleError);
  }

  // TODO: Ensure this is never called, and is not provided, in production.
  getArticlesSlowly (): Promise<Article[]> {
    // Simulate 2s of server latency.
    return new Promise(resolve => {
      setTimeout(() => resolve(this.getArticles()), 2000);
    });
  }

  handleError (err: any): Promise<any> {
    console.error(err);
    return Promise.reject(err.message || err);
  }
}
