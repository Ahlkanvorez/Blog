import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Article } from "./article";

@Injectable()
export class ArticleService {

  private articlesUrl = 'api/articles';

  constructor (private http: Http) {}

  getArticles (): Promise<Article[]> {
    return this.http.get(this.articlesUrl)
      .toPromise()
      .then(res => res.json().data as Article[])
      .catch(this.handleError);
  }

  getArticle (title: string): Promise<Article> {
    // Note: The annoying in-memory-data service uses the pattern :base/:collectionName/:id?, so the title parameter has
    // to be passed via ?title=___. This is annoying, and should not be reflected in the server-side REST api.
    return this.http.get(`${this.articlesUrl}/?title=${title}`)
      .toPromise()
      .then(res => res.json().data[0] as Article)
      .catch(this.handleError);
  }

  handleError (err: any): Promise<any> {
    console.error(err);
    return Promise.reject(err.message || err);
  }
}
