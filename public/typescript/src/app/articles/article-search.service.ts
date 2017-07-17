import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Article } from './article';

@Injectable()
export class ArticleSearchService {
  constructor (private http: Http) {}

  search (term: string): Observable<Article[]> {
    return this.http
      .get(`api/articles/?title=${term}`)
      .map(res => res.json().data as Article[]);
  }
}
