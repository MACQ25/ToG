import { Component, computed, effect, input, model, signal, ViewChild } from '@angular/core';
import { SetsService } from '../../core/services/cardServices/sets.service';
import { Set } from '../../core/interfaces/set';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, forkJoin, defaultIfEmpty, tap } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetAutocompleteComponent } from '../set-autocomplete/set-autocomplete.component';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-set-icon-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatChipsModule, 
    MatIconModule,
    MatProgressSpinnerModule, 
    SetAutocompleteComponent
  ],
  templateUrl: './set-icon-box.component.html',
  styleUrl: './set-icon-box.component.scss',
})
export class SetIconBoxComponent {
  
  setSelectField = new FormControl<string | Set>('');

  @ViewChild('auto') autocomplete!: SetAutocompleteComponent

  isLoading = signal<boolean>(true)

  edit = input<boolean>(true);

  chosen = model<any>()

  exclusions = computed(() => {

    if (!this.edit()) return null 

    let toReturn = {}

    const selected = [...this.chosen().map((elem: Set) => elem.id)]
    if (selected.length > 0){
      Object.assign(toReturn, {selected: selected});
    }

    return Object.keys(toReturn).length > 0 ? toReturn : null; 
  })

  constructor(setServ: SetsService){
    toObservable(this.chosen).pipe(
      switchMap(sets => forkJoin((sets ?? []).map((s: Set) => {return setServ.handleRegisty(s.code)}))
        .pipe(defaultIfEmpty([]))),
      tap(() => {this.isLoading.set(false);}),
      takeUntilDestroyed()
    ).subscribe();

  }

  remove(set: Set): void {
    this.chosen.update(sets => {
      const index = sets.indexOf(set);
      if (index < 0) {
        return sets;
      }

      sets.splice(index, 1);
      //this.announcer.announce(`Removed ${sets.name}`);
      return [...sets];
    });
  }

  onSetSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value
    // Add our fruit
    if (value) {
      this.chosen.update(sets => [...sets, value]);
    }
  }

}
