import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ArticleSearchService } from './article-search.service';
import { Article } from './article';

@Component({
  selector: 'article-search',
  templateUrl: './article-search.component.html',
  styleUrls: [ './article-search.component.css' ],
  providers: [ ArticleSearchService ]
})
export class ArticleSearchComponent implements OnInit {
  articles: Observable<Article[]>;
  private searchTerms = new Subject<string>();

  constructor (private articleSearchService: ArticleSearchService, private router: Router) {}

  // Push a search term into the observable stream
  search (term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit (): void {
    this.articles = this.searchTerms
      .debounceTime(300)      // Wait 300ms after each keystroke before considering the term
      .distinctUntilChanged() // ignore the next term if it is the same as the last term
      .switchMap(term => term // Switch to the next observable each time the term changes.
        ? this.articleSearchService.search(term)  // return the HTTP search observable
        : Observable.of<Article[]>([]))           // or an observable of an empty Article array if there was no term
      .catch(err => {
        console.error(err);
        return Observable.of<Article[]>([]);
      });
  }

  view (article: Article): void {
    this.router.navigate(['/articles', article.title])
      .catch(err => console.error(err));
  }
}
