import { Component, bind } from '@angular/core';

// import router goodies
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';

// import our two components we will route between
import { AboutComponent } from 'app/about.component';
import { HomeComponent } from 'app/home.component';

@Component({
  selector: 'demo-app',
  template: `
    <a [routerLink]="['/']">Home</a>
	  <a [routerLink]="['/about']">About</a>
    <div class="outer-outlet">
      <router-outlet></router-outlet>
    </div>
  `,
  // add our router directives we will be using
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
    // these are our two routes
    { path: '/', component: HomeComponent }, // , useAsDefault: true}, // coming soon
    { path: '/about', component: AboutComponent }
])
export class AppComponent { }