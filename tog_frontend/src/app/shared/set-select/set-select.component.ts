import { Component, computed, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetSelectService } from '../../core/services/cardServices/set-select.service';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable, startWith, map, combineLatest } from 'rxjs';
import { Set } from '../../core/interfaces/set';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

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
  templateUrl: './set-select.component.html',
  styleUrl: './set-select.component.scss'
})
export class SetSelectComponent {
  myControl = new FormControl<string | Set>('');
  filteredOptions: Observable<Set[]>;
  clearBtn = computed(() => this.selectServ.selected() ? true : false)

  @ViewChild('auto') autocomplete!: MatAutocomplete

  constructor(public selectServ: SetSelectService) {
    const list$ = toObservable(this.selectServ.list);

    this.filteredOptions = combineLatest([
      this.myControl.valueChanges.pipe(startWith('')),
      list$,
    ]).pipe(
      map(([value, list]) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name && name !== '' ? this._filter(name as string, list) : list.slice();
      }),
    );
  }

  displayFn(set: Set): string {
    return set && set.name ? set.name : '';
  }

  private _filter(name: string, list: Set[]): Set[] {
    const filterValue = name.toLowerCase();
    return list.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selected: Set = event.option.value;
    this.selectServ.selected.set(selected);
  }

  clear(event: MouseEvent){
    event?.stopPropagation();
    this.myControl.setValue('');
    this.selectServ.selected.set(undefined);
    this.autocomplete.options.forEach((opt) => opt.deselect());
  }
}
