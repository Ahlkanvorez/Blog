import { Component } from '@angular/core';

export class Article {
  title: string;
  author: { name: string; email: string; };
  date: Date;
  category: { type: string };
  content: string;
  sticky: boolean;
  image: string;
  image_dimensions: { width: number, height: number };
}

@Component({
  selector: 'blog',
  template: `<h1>Hello {{name}}</h1>`,
})
export class AppComponent {
  name = 'Blog';
}
