import { Component, computed, DestroyRef, inject, input, model, output, signal, ViewChild, viewChild } from '@angular/core';
import { Set } from '../../core/interfaces/set';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { switchMap, startWith, combineLatest, map, Observable, tap, catchError, of, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { SetsService } from '../../core/services/cardServices/sets.service';


@Component({
  selector: 'app-set-autocomplete',
  standalone: true,
  imports: [MatAutocompleteModule, MatIconModule],
  templateUrl: './set-autocomplete.component.html',
  styleUrl: './set-autocomplete.component.scss',
})
export class SetAutocompleteComponent {
  
  private destroyRef = inject(DestroyRef);


  /** DATA AND VARIABLES*/
  
  /** The same control that is bound to the input in the parent */
  control = input.required<AbstractControl>();

  /** The parent binds this to [matAutocomplete] */
  private readonly matAuto = viewChild.required<MatAutocomplete>('matAuto');

  blockMode = input<boolean>(false);
  
  isLoading = model<boolean>(true);

  exclude = input<any>(null);

  clearOnSelect = input(false);

  optionSelected = output<MatAutocompleteSelectedEvent>();
  
  private options$: Observable<Set[]> = toObservable(this.blockMode).pipe(
      switchMap(isBlock => {
        this.isLoading.set(true);
        return (isBlock ? this.setServ.listBlocks() : this.setServ.listSets())
          .pipe(
              catchError(() => of([] as Set[])),  // a failed fetch shouldn't leave it loading forever
              tap(() => this.isLoading.set(false)),
          );
      }),
      takeUntilDestroyed(this.destroyRef)
  );

  private options = toSignal(this.options$, { initialValue: [] as Set[] });

  private controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap(ctrl => ctrl.valueChanges.pipe(startWith(ctrl.value))),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null as string | Set | null },
  );

  filteredOptions = computed(() => {
    const value = this.controlValue();
    const list = this.options();
    const exclusions = this.exclude();  

    const name = typeof value === 'string' ? value : value?.name;
    return name || exclusions ? this._filter(name, list, exclusions) : list.slice();
  });


  constructor(public setServ: SetsService) {}


  /** DISPLAY LOGIC */


  protected displayFn = (o: Set | string | null): string =>
    typeof o === 'object' && o ? o.name : (o ?? '');

  protected _filter = (name: string, list: Set[], exclusions?: any): Set[] => {
    if(exclusions){
      return list.filter(option => 
            option.name.toLowerCase().includes(name.toLowerCase()) &&
            !exclusions.selected.includes(option.id)
          );
    } else {
      return list.filter(option => option.name.toLowerCase().includes(name.toLowerCase()))
    }
      
    }

  /** EMITTING TO PARENT COMPONENTS */


  get child(): MatAutocomplete { return this.matAuto();  }

  onSetSelected(event: MatAutocompleteSelectedEvent) {
    this.optionSelected.emit(event);
    if (this.clearOnSelect()) this.control().setValue('');
  }
  
}
