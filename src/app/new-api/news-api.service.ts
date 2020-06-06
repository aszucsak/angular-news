import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, switchMap, tap, pluck } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

export interface Article {
  url: string;
  title: string;
  source: {
    name: string;
  };
}

interface NewApiResponse {
  totalResults: number;
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = 'e2551882a9764f57878b006bbce00bb7';
  private country = 'us';

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) {
    this.numberOfPages = new Subject();
    this.pagesInput = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map(page => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', String(this.pageSize))
          .set('page', String(page));
      }),
      switchMap((params) => {
        return this.http.get<NewApiResponse>(
          this.url,
          { params }
        );
      }),
      tap(response => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    );
  }

  getPage(page: number) {
    this.pagesInput.next(page);
  }
}
