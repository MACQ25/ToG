import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ErrorlabelComponent } from '../../shared/errorlabel/errorlabel.component';
import { RouterLink } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIcon, MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    RouterLink,
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    AuthRoutingModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    ErrorlabelComponent,
    MatCheckboxModule,
    MatIconModule
  ],
   providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
export class AuthModule { }
