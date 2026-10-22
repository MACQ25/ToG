import { ChangeDetectionStrategy, Component, computed, effect, input, model, signal, ViewChild } from '@angular/core';
import { SetsService } from '../../core/services/cardServices/sets.service';
import { Set } from '../../core/interfaces/set';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, forkJoin, defaultIfEmpty, tap, of } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetAutocompleteComponent } from '../set-autocomplete/set-autocomplete.component';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';


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
    SetAutocompleteComponent,
    MatCardModule
  ],
  templateUrl: './set-icon-box.component.html',
  styleUrl: './set-icon-box.component.scss',
})
export class SetIconBoxComponent {
  
  setSelectField = new FormControl<string | Set>('');

  @ViewChild('auto') autocomplete!: SetAutocompleteComponent

  isLoading = signal<boolean>(true)

  predef = input<boolean>(false);

  iePools = input<boolean>(false)

  chosen = model<any>()

  exclusions = computed(() => {

    if (this.predef()) return null 

    let toReturn = {}

    const selected = [...this.chosen().map((elem: Set) => elem.id)]
    if (selected.length > 0){
      Object.assign(toReturn, {selected: selected});
    }

    return Object.keys(toReturn).length > 0 ? toReturn : null; 
  })

  constructor(setServ: SetsService){
    toObservable(this.chosen).pipe(
      switchMap(sets => 
        Array.isArray(sets) ?
          forkJoin(
              (sets ?? []).map((s: Set) => { return setServ.handleRegisty(s.code) })
          ).pipe(defaultIfEmpty([]))
        : of(sets)
      ),
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
