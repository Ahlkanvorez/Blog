import { Component } from '@angular/core';

@Component({
  selector: 'blog',
  template: `
  <h1>{{ title }}</h1>
  <articles></articles>`
})
export class AppComponent {
  title = 'Blog';
}
