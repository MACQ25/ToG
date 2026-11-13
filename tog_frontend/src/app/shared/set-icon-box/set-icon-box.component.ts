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
import { ChipBlockComponent } from './chip-block/chip-block.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';


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
    MatCardModule,
    ChipBlockComponent,
    CdkDropListGroup
  ],
  templateUrl: './set-icon-box.component.html',
  styleUrl: './set-icon-box.component.scss',
})
export class SetIconBoxComponent {
  
  setSelectField = new FormControl<string | Set>('');

  @ViewChild('auto') autocomplete!: SetAutocompleteComponent

  isLoading = signal<boolean>(true);

  predef = input<boolean>(false);

  blockName = input<any>('');

  mPools = input<boolean>(false);

  iePools = input<boolean>(false);

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
      switchMap(sets => {
        this.isLoading.set(true);
        return Array.isArray(sets) ?
            forkJoin(
                (sets ?? []).map((s: Set) => { return setServ.handleRegisty(s.code) })
            ).pipe(defaultIfEmpty([]))
          : of(sets)
        }
      ),
      tap((sets: Set[] | Object) => 
        this.isLoading.set(
          !( (Array.isArray(sets) && sets.length > 0) || (Object.keys(sets).length > 0) || !this.predef() )
        )
    ),
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

  move(event: any){
    
    const data = this.chosen()
    let ori: Set[];
    let k1 = '';
    let tar: Set[];
    let k2 = '';
 
    switch(event.fromId.toString().toLowerCase()){
      case 'sets legal':
        k1 = 'included'; ori = data.included; break;
      case 'to be released':
        k1 = 'toRelease'; ori = data.toRelease; break;
      default:
        ori = [] as Set[]
    }

    switch(event.toId.toString().toLowerCase()){
      case 'sets legal':
        k2 = 'included'; tar = data.included; break;
      case 'to be released':
        k2 = 'toRelease'; tar = data.toRelease; break;
      default:
        tar = [] as Set[]
    }
    


    tar.splice(event.currentIndex, 0, ori.splice(event.previousIndex, 1)[0])

    this.chosen.update((slf) => {
      slf[k1] = ori;
      slf[k2] = tar;
      return slf;
    })


  }

}
