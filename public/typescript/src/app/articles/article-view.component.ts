import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Article } from "./article";
import { ArticleService } from './article.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'article-view',
  templateUrl: './article-view.component.html'
})
export class ArticleViewComponent implements OnInit {
  @Input() article: Article;

  constructor (private articleService: ArticleService, private route: ActivatedRoute, private location: Location) {}

  ngOnInit (): void {
    // Extract the name from the parameters, and populate the article member accordingly from the article service.
    this.route.paramMap
      .switchMap((params: ParamMap) => this.articleService.getArticle(params.get('title')))
      .subscribe(article => this.article = article);
  }
}
