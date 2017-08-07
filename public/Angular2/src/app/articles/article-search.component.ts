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

  constructor (private articleSearchService: ArticleSearchService,
               private router: Router) {}

  // Push a search term into the observable stream
  search (term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit (): void {
    this.articles = this.searchTerms
      // Wait 300ms after each keystroke before considering the term
      .debounceTime(300)
      // ignore the next term if it is the same as the last term
      .distinctUntilChanged()
      // Switch to the next observable each time the term changes.
      .switchMap(term => term
        // return the HTTP search observable
        ? this.articleSearchService.search(term)
        // or an observable of an empty Article array if there was no term
        : Observable.of<Article[]>([]))
      .catch(err => {
        console.error(err);
        return Observable.of<Article[]>([]);
      });
  }

  view (article: Article): void {
    this.router.navigate(['/articles', article.title.split(' ').join('-')])
      .catch(err => console.error(err));
  }
}
