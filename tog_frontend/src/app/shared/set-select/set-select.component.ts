import { Component, computed, forwardRef, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable, startWith, map, combineLatest } from 'rxjs';
import { Set } from '../../core/interfaces/set';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { SetsService } from '../../core/services/cardServices/sets.service';

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
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
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

  @ViewChild('auto') autocomplete!: MatAutocomplete

  setSelectField = new FormControl<string | Set>('');
  filteredOptions: Observable<Set[]>;
  onChange: any = () => {};
  onTouched: any = () => {};
  isDisabled: boolean = false

  current = toSignal(this.setSelectField.valueChanges, { initialValue: this.setSelectField.value });

  selectedIcon = computed(() => {
    const v = this.current();
    return v && typeof v !== 'string' ? v.icon : null;   // only a real Set has an icon
  });

  clearBtn = computed(() => {
    const v = this.current();
    return v && typeof v !== 'string' ? true : false
  })


  constructor(public setServ: SetsService) {

    let sets = this.setServ.listSets();

    this.filteredOptions = combineLatest([
      this.setSelectField.valueChanges.pipe(startWith('')),
      sets,
    ]).pipe(
      map(([value, list]) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name && name !== '' ? this._filter(name as string, list) : list.slice();
      }),
    );
  }


  writeValue(obj: any): void {
    this.setSelectField.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  displayFn(set: Set): string {
    return set && set.name ? set.name : '';
  }

  private _filter(name: string, list: Set[]): Set[] {
    const filterValue = name.toLowerCase();
    return list.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  clear(event?: MouseEvent){
    //event?.stopPropagation();
    this.setSelectField.setValue(null);
    this.autocomplete.options.forEach((opt) => opt.deselect());
    this.onChange(null)
  }
}
