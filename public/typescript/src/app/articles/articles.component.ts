import { Component, OnInit } from '@angular/core';
import { Article } from "./article";
import { ArticleService } from "./article.service";

// TODO: Order articles by stickiness first, then date.
@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: [ './articles.component.css' ],
  providers: [ ArticleService ]
})
export class ArticlesComponent implements OnInit {
  name = 'Articles';

  articles: Article[];

  constructor (private articleService: ArticleService) {}

  getArticles (): void {
    this.articleService.getArticles()
      .then(articles => this.articles = articles
        .sort((a: Article, b: Article) => {
          const A = -1; // this indicates A is less
          const B = 1;  // this indicates B is less.
          if (a.sticky && !b.sticky) {
            return A;
          } else if (b.sticky && !a.sticky) {
            return B;
          }
          return a.date < b.date ? A : B;
        }))
      .catch(err => console.error(err));
  }

  ngOnInit () {
    this.getArticles();
  }
}
