import { Component } from '@angular/core';
import { Routes, RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'about-home',
  template: `<h3>About Home</h3>`
})
class AboutHomeComponent { }

@Component({
  selector: 'about-item',
  template: `<h3>About Item Id: {{id}}</h3>`
})
class AboutItemComponent { 
  id: any;
  constructor(routeSegment: RouteSegment) {
    this.id = routeSegment.getParam('id');
  }
}

@Component({
    selector: 'app-about',
    template: `
      <h2>About</h2>
	    <a [routerLink]="['/']">Home</a>
	    <a [routerLink]="['/about/item', 1]">Item 1</a>
	    <a [routerLink]="['/about/item', 2]">Item 2</a>
      <div class="inner-outlet">
        <router-outlet></router-outlet>
      </div>
    `,
    directives: [ROUTER_DIRECTIVES]
})
@Routes([
  { path: '/', component: AboutHomeComponent }, // , useAsDefault: true}, // coming soon
  { path: '/item/:id', component: AboutItemComponent }
])
export class AboutComponent { }