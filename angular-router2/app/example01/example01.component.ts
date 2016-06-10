import { Component } from '@angular/core';
import { OnActivate, Router, RouteSegment } from '@angular/router';

@Component({
  template: `
  <h2>Example 01</h2>
  `,
})
export class Example01Component implements OnActivate  {

  constructor(
    private router: Router) {}

}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/