import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Article } from './article';
import {ArticleService} from "./article.service";

@Injectable()
export class ArticleSearchService {
  constructor (private http: Http, private articleService: ArticleService) {}

  search (term: string): Observable<Article[]> {
    // TODO: Fix for real server routes.
    return this.http
      .get(`https://www.hrodebert.com/blog/article-list`)
      .map((res: any) => (JSON.parse(res._body) as Article[])
        .filter(article => article.title.includes(term)
                            || article.content.includes(term)));
  }
}
