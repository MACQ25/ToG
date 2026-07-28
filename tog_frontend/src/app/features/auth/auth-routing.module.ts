import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CardShellComponent } from '../../shared/card-shell/card-shell.component';

const routes: Routes = [
  {
    path: '',
    component: CardShellComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login Page'
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Sign Up Page'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
