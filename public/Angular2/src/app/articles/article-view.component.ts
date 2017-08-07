import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from "./article";
import { Category } from "../categories/category";
import { ArticleService } from './article.service';
import { CategoryService } from "../categories/category.service";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'article-view',
  templateUrl: './article-view.component.html',
  styleUrls: [ './article-view.component.css' ]
})
export class ArticleViewComponent implements OnInit {
  article: Article;
  category: Category;
  similarArticles: Article[];

  constructor (private articleService: ArticleService,
               private categoryService: CategoryService,
               private route: ActivatedRoute) {}

  ngOnInit (): void {
    // Extract the name from the parameters, and populate the article member
    // accordingly from the article service.
    this.route.paramMap
      .switchMap((params: ParamMap) => this.articleService
          .getArticle(params.get('title').split('-').join(' ')))
      .subscribe(article => {
        this.article = article;

        // Once the article has been gathered, grab the appropriate category.
        this.route.paramMap
          .switchMap((params: ParamMap) => this.categoryService
              .getCategory(this.article.category))
          .subscribe(category => this.category = category);

        // Also get a list of articles in the same category as the one being
        // viewed, and sort them by title.
        this.articleService.getArticles()
          .then(articles => this.similarArticles = articles
            .filter(article => article.category === this.article.category
                                && article._id !== this.article._id)
            .sort((a: Article, b: Article) => a.title.localeCompare(b.title)))
          .catch(console.error);
      });
  }
}
