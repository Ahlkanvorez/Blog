import { Component } from '@angular/core';

@Component({
  selector: 'blog',
  template: `<h1>Hello {{name}}</h1>`,
})
export class AppComponent {
  name = 'Blog';
}
