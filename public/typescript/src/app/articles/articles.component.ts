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

  getArticles (): void {
    this.articleService.getArticles()
      .then(articles => this.articles = articles
        // Latest Articles is the default category, so if that's the category, return all articles.
        .filter(article => this.category.name === 'Latest Articles' || article.category === this.category.name)
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

  getCategories (): void {
    this.categoryService.getCategories()
      .then(categories => this.categories = categories
        // Only list categories which have at least one linkable article.
        .filter(category => category.name === 'Latest Articles' || this.articles.find(article => article.category === category.name))
        .sort((a: Category, b: Category) => a.name.localeCompare(b.name)))
      .catch(err => console.error(err));
  }

  getCategory (): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.categoryService.getCategory(params.get('category') || ''))
      .subscribe(category => this.category = category);
  }

  ngOnInit () {
    // Ensure the category has been retrieved before articles are loaded, so the articles can
    // be properly filtered by category if appropriate. Get the categories last, so they can
    // be filtered to only link to categories which have at least one article (any others
    // should not exist, but just to be safe ...)
    this.getCategories();
    Promise.resolve()
      .then(() => this.getCategory())
      .then(() => this.getArticles())
      .then(() => this.getCategories());
  }
}
