import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from "./article";
import { ArticleService } from "./article.service";
import { Category } from "../categories/category";
import { CategoryService } from "../categories/category.service";
import 'rxjs/add/operator/switchMap';

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
  category: Category;

  constructor (private articleService: ArticleService,
               private categoryService: CategoryService,
               private route: ActivatedRoute) {}

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

  getCategory (): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.categoryService.getCategory(params.get('category') || ''))
      .subscribe(category => this.category = category);
  }

  ngOnInit () {
    this.getArticles();
    this.getCategory();
  }
}
