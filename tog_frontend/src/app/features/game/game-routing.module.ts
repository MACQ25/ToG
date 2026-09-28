import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectComponent } from './select/select.component';
import { SelectRouteToggleComponent } from './select-route-toggle/select-route-toggle.component';
import { CreateComponent } from './create/create.component';
import { JoinComponent } from './join/join.component';
import { FormCardUIComponent } from '../../shared/form-card-ui/form-card-ui.component';

const routes: Routes = [
  {
    path: 'enter',
    component: FormCardUIComponent,
    children: [
      {
        path: '',
        component: SelectComponent,
        title: 'An Old Gathering',
        children: [
          {
            path: '',
            component: SelectRouteToggleComponent
          },
          {
            path: 'create',
            component: CreateComponent
          },
          {
            path: 'join',
            component: JoinComponent
          },
        ]
      }
    ],
  },
  {
    path: '',
    redirectTo: 'enter',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }