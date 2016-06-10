import {provide} from '@angular/core';
import { bootstrap }        from '@angular/platform-browser-dynamic';
import {RouteConfig, Location, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AppComponent }     from './app.component';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/