import { Component } from '@angular/core';

import { NewsApiService, Article } from '../news-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css']
})
export class NaArticleListComponent {
  articles: Article[];
  numberOfPages: number;

  currentPage = 1;

  constructor(private newsApiService: NewsApiService) {
    this.newsApiService.numberOfPages.subscribe(num => {
      this.numberOfPages = num;
    });
    this.newsApiService.pagesOutput.subscribe(response => {
      this.articles = response;
    });
    this.newsApiService.getPage(1);
  }


  onPageChange(page: number) {
    this.newsApiService.getPage(page);
    this.currentPage = page;
  }

}
