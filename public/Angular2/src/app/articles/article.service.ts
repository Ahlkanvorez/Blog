import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Article } from "./article";

@Injectable()
export class ArticleService {

  // development var:
  // private articlesUrl = 'api/articles';
  private articlesUrl = 'https://www.hrodebert.com/blog';

  private cache: Article[];

  constructor (private http: Http) {}

  getArticles (): Promise<Article[]> {
    // Development request
    // return this.http.get(this.articlesUrl)
    if (this.cache && this.cache.length > 0) {
      return Promise.resolve(this.cache);
    }
    return this.http.get(`${this.articlesUrl}/article-list`)
      .toPromise()
      .then((res: any) => {
        this.cache = JSON.parse(res._body) as Article[];
        return this.cache;
      })
      .catch(this.handleError);
  }

  getArticle (title: string): Promise<Article> {
    // Note: The annoying in-memory-data service uses the pattern :base/:collectionName/:id?, so the title parameter has
    // to be passed via ?title=___. This is annoying, and should not be reflected in the server-side REST api.
    // return this.http.get(`${this.articlesUrl}/?title=${title}`)
    if (this.cache && this.cache.length > 0) {
      return Promise.resolve(this.cache.find(article => article.title === title));
    }
    return this.http.get(`${this.articlesUrl}/get-article/title/${title}`)
      .toPromise()
      .then((res: any) => JSON.parse(res._body) as Article)
      .catch(this.handleError);
  }

  handleError (err: any): Promise<any> {
    console.error(err);
    return Promise.reject(err.message || err);
  }
}
