import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getErrorMessage } from '../../core/validation/custom-validation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-errorlabel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './errorlabel.component.html',
  styleUrl: './errorlabel.component.scss',
})
export class ErrorlabelComponent {
  @Input() control!: FormControl

  getErrorMessage = getErrorMessage;

  constructor() {  }
}
