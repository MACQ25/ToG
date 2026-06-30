import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CurseValidation, PasswordStrength } from '../../../core/validation/custom-validation';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, PasswordStrength])
    })

    matcher = new MyErrorStateMatcher();

    constructor(private router: Router, private registry: AuthService){}
    

    async loginAccount(): Promise<void> {
      console.log( this.loginForm.value.email ?? '', this.loginForm.value.password ?? '')

    
      this.registry.login(
        this.loginForm.value.email ?? '',
        this.loginForm.value.password ?? ''
      ).subscribe({
        next: res =>  this.router.navigate(['/']),

        //res => console.log('Response:', res),
        error: err => {
          console.error('Error:', err);
        }
      }
      );
    
  }
}
