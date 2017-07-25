import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Article } from "./article";

@Injectable()
export class ArticleService {

  // development var:
  // private articlesUrl = 'api/articles';
  private articlesUrl = 'https://www.hrodebert.com/blog';

  constructor (private http: Http) {}

  getArticles (): Promise<Article[]> {
    // Development request
    // return this.http.get(this.articlesUrl)
    return this.http.get(`${this.articlesUrl}/article-list`)
      .toPromise()
      .then(res => JSON.parse(res.body) as Article[])
      .catch(this.handleError);
  }

  getArticle (title: string): Promise<Article> {
    // Note: The annoying in-memory-data service uses the pattern :base/:collectionName/:id?, so the title parameter has
    // to be passed via ?title=___. This is annoying, and should not be reflected in the server-side REST api.
    // return this.http.get(`${this.articlesUrl}/?title=${title}`)
    return this.http.get(`${this.articlesUrl}/get-article/${title}`)
      .toPromise()
      .then(res => JSON.parse(res.body)[0] as Article)
      .catch(this.handleError);
  }

  handleError (err: any): Promise<any> {
    console.error(err);
    return Promise.reject(err.message || err);
  }
}
