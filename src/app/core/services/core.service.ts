import { Injectable } from '@angular/core';
import { ShellComponent } from '../layout/shell/shell.component';
import { Route, Routes } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes
    };
  }
}
