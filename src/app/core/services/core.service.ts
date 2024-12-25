import { inject, Injectable } from '@angular/core';
import { ShellComponent } from '../layout/shell/shell.component';
import { Route, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private httpClient: HttpClient = inject(HttpClient);

  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
    };
  }
}
