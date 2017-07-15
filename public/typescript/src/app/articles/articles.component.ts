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

  constructor (private articleService: ArticleService) {

  }

  getArticles (): void {
    // TODO: Use the normal getArticles() method in production.
    this.articleService.getArticlesSlowly()
      .then(articles => this.articles = articles)
      .catch(err => console.error(err));
  }

  ngOnInit () {
    this.getArticles();
  }
}
