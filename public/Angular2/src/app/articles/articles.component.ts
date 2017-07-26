import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from "./article";
import { ArticleService } from "./article.service";
import { Category } from "../categories/category";
import { CategoryService } from "../categories/category.service";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: [ './articles.component.css' ],
  providers: [ ArticleService ]
})
export class ArticlesComponent implements OnInit {
  name = 'Articles';

  articles: Article[];
  categories: Category[];
  category: Category;

  constructor (private articleService: ArticleService,
               private categoryService: CategoryService,
               private route: ActivatedRoute) {}

  getCategory (): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.categoryService.getCategory(params.get('category') || ''))
      .subscribe(category => {
        this.category = category;
        this.getArticles();
      });
  }

  getArticles (): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.articleService.getArticles())
      .subscribe(articles => {
        this.articles = articles
          .filter(article => this.category.name === 'Latest Articles'
            || this.category.name === 'Everything'
            || article.category === this.category.name)
          .sort((a: Article, b: Article) => {
            const A = -1; // this indicates A is less
            const B = 1;  // this indicates B is less.
            // Put sticky articles at the top
            if (a.sticky && !b.sticky) {
              return A;
            } else if (b.sticky && !a.sticky) {
              return B;
            }
            // Otherwise, put newer articles at the top.
            return a.date > b.date ? A : B;
          });
        this.getCategories();
      });
  }

  getCategories (): void {
    this.categoryService.getCategories()
      .then(categories => this.categories = categories
        .sort((a: Category, b: Category) => a.name.localeCompare(b.name)))
      .catch(console.error);
  }

  ngOnInit () {
    // Ensure the category has been retrieved before articles are loaded, so the articles can
    // be properly filtered by category if appropriate. Get the categories last, so they can
    // be filtered to only link to categories which have at least one article (any others
    // should not exist, but just to be safe ...)
    this.getCategory();
  }
}
