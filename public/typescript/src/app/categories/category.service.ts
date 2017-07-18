import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Category } from './category';

@Injectable()
export class CategoryService {
  private categoriesUrl = 'api/categories';

  constructor (private http: Http) {}

  getCategories (): Promise<Category[]> {
    return this.http.get(this.categoriesUrl)
      .toPromise()
      .then(res => res.json().data as Category[])
      .catch(this.handleError);
  }

  getCategory (name: string): Promise<Category> {
    return this.http.get(`${this.categoriesUrl}/?name=${name}`)
      .toPromise()
      .then(res => res.json().data[0] as Category)
      .catch(this.handleError);
  }

  handleError (err: any): Promise<any> {
    console.error(err);
    return Promise.reject(err.message || err);
  }
}
