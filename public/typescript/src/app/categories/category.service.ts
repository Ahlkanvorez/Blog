import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Category } from './category';

@Injectable()
export class CategoryService {
  private categoriesUrl = 'api/categories';
  private defaultCategory: Category = {
    _id: '0',
    name: 'Latest Articles',
    description: '"What the heart liketh best, the mind studieth most." - Richard Sibbes',
    aboutAuthor: 'Robert Mitchell is Reformed & Presbyterian (a member of the OPC), a reader of Classics, Mathematics, Poetry, Philosophy & Theology, and a student of Chinese, Greek & Latin.'
  };

  constructor (private http: Http) {}

  getCategories (): Promise<Category[]> {
    return this.http.get(this.categoriesUrl)
      .toPromise()
      .then(res => res.json().data as Category[])
      .catch(this.handleError);
  }

  getCategory (name: string): Promise<Category> {
    console.log(name);
    if (name === '') {
      return Promise.resolve(this.defaultCategory);
    }
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
