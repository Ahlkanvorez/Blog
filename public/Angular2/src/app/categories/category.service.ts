import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Category } from './category';

@Injectable()
export class CategoryService {

  // development var:
  // private categoriesUrl = 'api/categories';
  private categoriesUrl = 'https://www.hrodebert.com/blog';

  // Default category needs to be present as soon as the object is instantiated.
  private defaultCategory = {
    _id: '0',
    name: 'Everything',
    description: '"What the heart liketh best, the mind studieth most." - '
      + 'Richard Sibbes',
    aboutAuthor: 'Robert Mitchell is Reformed & Presbyterian (a member of the '
      + 'OPC), a reader of Classics, Mathematics, Poetry, Philosophy & '
      + 'Theology, and a student of Chinese, Greek & Latin.'
  };

  constructor (private http: Http) {}

  getCategories (): Promise<Category[]> {
    // development request
    // return this.http.get(this.categoriesUrl)
    return this.http.get(`${this.categoriesUrl}/category-list`)
      .toPromise()
      .then((res: any) =>  JSON.parse(res._body) as Category[])
      .catch(this.handleError);
  }

  getCategory (name: string): Promise<Category> {
    if (name === '' || name === 'Latest Articles' || name === 'Everything') {
      return Promise.resolve(this.defaultCategory);
    }
    // development request
    // return this.http.get(`${this.categoriesUrl}/?name=${name}`)
    return this.http.get(`${this.categoriesUrl}/get-category/${name}`)
      .toPromise()
      .then((res: any) => JSON.parse(res._body)[0] as Category)
      .catch(this.handleError);
  }

  handleError (err: any): Promise<any> {
    console.error(err);
    return Promise.reject(err.message || err);
  }
}
