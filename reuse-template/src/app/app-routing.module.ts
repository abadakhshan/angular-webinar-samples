import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Content0Component } from './scenario0/content/content.component';
import { Content1Component } from './scenario1/content/content.component';

const routes: Routes = [
  {
    path: 'ng-content',
    component: Content0Component,
  },
  {
    path: 'container',
    component: Content1Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
