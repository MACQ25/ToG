import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CurseValidation, PasswordStrength } from '../../../core/validation/custom-validation';
import { AuthService } from '../../../core/services/baseServices/auth.service';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
    registerForm = new FormGroup({
      userName: new FormControl('', [Validators.required, CurseValidation]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, PasswordStrength])
    })

    matcher = new MyErrorStateMatcher();

    constructor(private router: Router, private registry: AuthService){}

    async submitAccount(): Promise<void> {
      console.log(      this.registerForm.value.userName ?? '',
      this.registerForm.value.email ?? '',
      this.registerForm.value.password ?? '')

    
      this.registry.register(
        this.registerForm.value.userName ?? '',
        this.registerForm.value.email ?? '',
        this.registerForm.value.password ?? '',
        false
      ).subscribe({
        next: res => this.router.navigate(['/auth/login']),
        //res => console.log('Response:', res),
        error: err => {
          console.error('Error:', err);
        }
      }
      );
    
  }
}
