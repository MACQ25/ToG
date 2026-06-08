import { Injectable } from '@angular/core';
import { Filter } from 'bad-words';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CurseValidation(control: AbstractControl): ValidationErrors | null {
  const mf = new Filter();

  const value = control.value ?? '';

  if (value && mf.isProfane(value)) {
    return { profane: true };
  }

  return null;
}

export function PasswordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const errors: ValidationErrors = {};

  if (!/[A-Z]/.test(value))            errors['missingUppercase'] = true;
  if (!/[a-z]/.test(value))            errors['missingLowercase'] = true;
  if (!/[0-9]/.test(value))            errors['missingNumber'] = true;
  if (!/.*[^\w\d\s]|[-_]/.test(value)) errors['missingSpecial'] = true;
  if (value.length < 8)                errors['minlength'] = { requiredLength: 8, actualLength: value.length };

  if (Object.keys(errors).length > 0) errors['passwordAny'] = true;

  return Object.keys(errors).length > 0 ? errors : null;
}

export function SameAs(targetControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return targetControl.value == control.value ? null : { mismatch: true }
  }
}

export function getErrorMessage(key: string, value: any): string {
  switch (key) {
    case 'required':
      return 'This field is required.';
    case 'minlength':
      return `Minimum length is ${value.requiredLength}.`;
    case 'profane':
      return 'This field contains inappropriate language.';
    case 'missingUppercase':
      return 'Password must contain at least one uppercase letter.';
    case 'missingLowercase':
      return 'Password must contain at least one lowercase letter.';
    case 'missingNumber':
      return 'Password must contain at least one number.';
    case 'missingSpecial':
      return 'Password must contain at least one special character.';
    case 'mismatch':
      return `This field must match with the above password.`;
    default:
      return 'Invalid field.';
  }
}
