/**
 * PLUNKER VERSION (based on systemjs.config.js in angular.io)
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 * Override at the last minute with global.filterSystemConfig (as plunkers do)
 */
(function(global) {
  //map tells the System loader where to look for things
  var  map = {
    'app':                               'app',
    'rxjs':                              'https://npmcdn.com/rxjs@5.0.0-beta.6',
    '@angular/common':                   'https://npmcdn.com/@angular/common@2.0.0-rc.1',
    '@angular/compiler':                 'https://npmcdn.com/@angular/compiler@2.0.0-rc.1',
    '@angular/core':                     'https://npmcdn.com/@angular/core@2.0.0-rc.1',
    '@angular/http':                     'https://npmcdn.com/@angular/http@2.0.0-rc.1',
    '@angular/platform-browser':         'https://npmcdn.com/@angular/platform-browser@2.0.0-rc.1',
    '@angular/platform-browser-dynamic': 'https://npmcdn.com/@angular/platform-browser-dynamic@2.0.0-rc.1',
    '@angular/router':                   'https://npmcdn.com/@angular/router@2.0.0-rc.1',
    '@angular/router-deprecated':        'https://npmcdn.com/@angular/router-deprecated@2.0.0-rc.1',
    '@angular/upgrade':                  'https://npmcdn.com/@angular/upgrade@2.0.0-rc.1'
  };

  //packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                               { main: 'main.ts',  defaultExtension: 'ts' },
    'rxjs':                              { defaultExtension: 'js' },
    '@angular/common':                   { main: 'index.js', defaultExtension: 'js' },
    '@angular/compiler':                 { main: 'index.js', defaultExtension: 'js' },
    '@angular/core':                     { main: 'index.js', defaultExtension: 'js' },
    '@angular/http':                     { main: 'index.js', defaultExtension: 'js' },
    '@angular/platform-browser':         { main: 'index.js', defaultExtension: 'js' },
    '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
    '@angular/router':                   { main: 'index.js', defaultExtension: 'js' },
    '@angular/router-deprecated':        { main: 'index.js', defaultExtension: 'js' },
    '@angular/upgrade':                  { main: 'index.js', defaultExtension: 'js' }
  };

  var config = {
    transpiler: 'typescript',
    typescriptOptions: {
      emitDecoratorMetadata: true
    },
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);
})(this);