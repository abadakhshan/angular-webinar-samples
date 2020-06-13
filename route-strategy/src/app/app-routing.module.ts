import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoaComponent } from './coa/coa.component';
import { AccountGroupComponent } from './account-group/account-group.component';
import { GlComponent } from './gl/gl.component';
import { SlComponent } from './sl/sl.component';
import { OtherComponent } from './other/other.component';

const routes: Routes = [
  {
    path: 'other',
    component: OtherComponent,
  },
  {
    path: 'coa',
    component: CoaComponent,
    data: {
      cacheChildren: true,
    },

    children: [
      {
        path: 'account-group',
        component: AccountGroupComponent,
      },
      {
        path: 'gl',
        component: GlComponent,
      },
      {
        path: 'sl',
        component: SlComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
