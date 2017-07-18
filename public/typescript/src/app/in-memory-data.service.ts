import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Article } from "./articles/article";

export class InMemoryDataService implements InMemoryDbService {
  createDb () {
    const articles: Article[]= [
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
        sticky: false,
        image: '',
        image_dimensions: { width: 0, height: 0 }
      },
      {
        _id: 3,
        title: 'When Learning a Dead Language, Read, Reread, and Reread Again',
        author: { name: "Robert Mitchell", email: 'robert.mitchell36@gmail.com'},
        date: new Date(),
        category: 'Classics',
        content: '<p>While many students of foreign language rely heavily on dialogue with native speakers for improvement, those of us learning dead languages such as Latin and ancient Greek tend to think we lack that luxury. It is true that we cannot simply come upon a native speaker in the wild, but we can still dialogue with native speakers in a meaningful and beneficial way: by drinking deeply from the literary traditions they left behind. These texts can be our conversation partners if we would simply allow them to lead the discussion, and test our abilities with a reply in their language. Still, reaching that level of experience where phrasing complex thoughts in the language is possible, is difficult. How does the student of a dead language raise his abilities that high above the dirt?</p>' +
        '<p>When I first started learning Latin, I knew from past experience in studying Mandarin that the best way to cement knowledge of grammar and vocabulary was to read as much as I could in the language to see them used properly as much as possible. After a few chapters of Wheelock\'s Latin, I became concerned that I wouldn\'t have that luxury, since most of the reading in the book was one-line sentences which often had grammatical ambiguities arising from lack of context greatly diminishing their utility. Because of this, the language remained foreign, not familiar: I could look at the text and determine what it meant, but the Latin felt uncomfortable.</p>',
        sticky: true,
        image: '',
        image_dimensions: { width: 0, height: 0 }
      }
    ];
    return { articles };
  }
}
