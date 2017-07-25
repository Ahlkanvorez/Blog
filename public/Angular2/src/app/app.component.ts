import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'blog',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Blog';

  constructor (private router: Router) {}

  ngOnInit () {
    this.router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
