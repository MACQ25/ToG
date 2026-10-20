import { Component, computed, effect, forwardRef, input, signal, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Set } from '../../core/interfaces/set';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SetAutocompleteComponent } from '../set-autocomplete/set-autocomplete.component';


@Component({
  selector: 'app-set-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SetAutocompleteComponent
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SetSelectComponent),
    multi: true
  }],
  templateUrl: './set-select.component.html',
  styleUrl: './set-select.component.scss'
})
export class SetSelectComponent implements ControlValueAccessor {

  blockMode = input<boolean>(false);

  @ViewChild('auto') autocomplete!: SetAutocompleteComponent

  setSelectField = new FormControl<string | Set>('');
  onChange: any = () => {};
  onTouched: any = () => {};
  
  isDisabled = signal<boolean>(false)
  isLoading = signal<boolean>(false)

  private writing = false;

  current = toSignal(this.setSelectField.valueChanges, { initialValue: this.setSelectField.value });

  selectedIcon = computed(() => {
    const v = this.current();
    return v && typeof v !== 'string' ? v.icon : null;   // only a real Set has an icon
  });

  clearBtn = computed(() => {
    const v = this.current();
    return v && typeof v !== 'string' ? true : false
  })


  constructor() {
      effect(() => {
        ( this.isDisabled() ||this.isLoading() )
          ? this.setSelectField.disable({ emitEvent: false })
          : this.setSelectField.enable({ emitEvent: false });
      });

      this.setSelectField.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(v => {
        if (this.writing) return;  // don't echo writeValue back up
        this.onChange(v && typeof v === 'object' ? v : null);
      });
  }

  clear(event?: MouseEvent){
    this.setSelectField.reset();
  }

  // CVA

  writeValue(obj: Set | null): void {
    this.writing = true;
    this.setSelectField.setValue(obj ?? '');
    this.writing = false;
  }

  registerOnChange(fn: any): void { this.onChange = fn; }

  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void { this.isDisabled.set(isDisabled) }

}
