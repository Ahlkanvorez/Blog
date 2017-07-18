import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from "./article";
import { Category } from "../categories/category";
import { ArticleService } from './article.service';
import { CategoryService } from "../categories/category.service";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'article-view',
  templateUrl: './article-view.component.html'
})
export class ArticleViewComponent implements OnInit {
  @Input() article: Article;
  @Input() category: Category;

  constructor (private articleService: ArticleService,
               private categoryService: CategoryService,
               private route: ActivatedRoute) {}

  ngOnInit (): void {
    // Extract the name from the parameters, and populate the article member accordingly from the article service.
    this.route.paramMap
      .switchMap((params: ParamMap) => this.articleService.getArticle(params.get('title')))
      .subscribe(article => {
        this.article = article;

        // Once the article has been gathered, grab the appropriate category.
        this.route.paramMap
          .switchMap((params: ParamMap) => this.categoryService.getCategory(this.article.category))
          .subscribe(category => this.category = category);
      });
  }
}
