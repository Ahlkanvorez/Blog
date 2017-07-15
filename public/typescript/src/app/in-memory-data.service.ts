import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Article} from "./articles/article";

export class InMemoryDataService implements InMemoryDbService {
  createDb () {
    const articles: Article[] = [
      {
        _id: 1,
        title: 'test1',
        author: { name: 'robert', email: 'a@b.c' },
        date: new Date(),
        category: 'test',
        content: 'this is a test article.  This sentence should only display on click. Same goes for this one.',
        sticky: false,
        image: '',
        image_dimensions: { width: 0, height: 0 }
      },
      {
        _id: 2,
        title: 'test2',
        author: { name: 'mitchell', email: 'a@b.c' },
        date: new Date(),
        category: 'test',
        content: 'this is another test article. This sentence should only display on click.',
        sticky: true,
        image: '',
        image_dimensions: { width: 0, height: 0 }
      }
    ];
    return { articles };
  }
}
