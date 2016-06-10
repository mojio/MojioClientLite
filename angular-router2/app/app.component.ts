import { Component, OnInit } from '@angular/core';
import { Routes, Router, ROUTER_DIRECTIVES } from '@angular/router';

import { CrisisCenterComponent } from './crisis-center/crisis-center.component';
import { HeroListComponent }     from './heroes/hero-list.component';
import { HeroDetailComponent }   from './heroes/hero-detail.component';

import { DialogService }         from './dialog.service';
import { HeroService }           from './heroes/hero.service';

import { Example01Component } from './example01/example01.component';

@Component({
  selector: 'my-app',
  template: `
    <div class="container-fluid">
    <h1 class="title">MojioClientLite Examples</h1>
    <nav>
      <a class="btn btn-default" [routerLink]="['/crisis-center']">Crisis Center</a>
      <a class="btn btn-default" [routerLink]="['/heroes']">Heroes</a>
      <a class="btn btn-default" [routerLink]="['/example01']">Example 01</a>
    </nav>
    <router-outlet></router-outlet>
    </div>
  `,
  providers:  [DialogService, HeroService],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  {path: '/crisis-center',  component: CrisisCenterComponent},
  {path: '/heroes',  component: HeroListComponent},
  {path: '/hero/:id', component: HeroDetailComponent},
  {path: '/example01',  component: Example01Component},
])
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/heroes']);
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/