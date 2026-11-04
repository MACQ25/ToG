import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SetsService } from '../cardServices/sets.service';
import { PodConfigService } from './pod-config.service';
import { startWith, switchMap, of } from 'rxjs';
import { Tertiary } from './pod-config.model';
import { Set } from '../../interfaces/set';

@Injectable()
export class PodFormService {
  private fb = inject(FormBuilder)
  private pcs = inject(PodConfigService)

  form = this.fb.group({
    main: new FormGroup({
      primary: new FormControl(null as number | null, [Validators.required]),
      secondary: new FormControl(null as number | null,),
      tertiary: new FormControl(null as Tertiary | null),
    }),
    cardPool: new FormControl(1, [Validators.required]),
    exchange: new FormGroup({
      tradingPlayers: new FormControl(false, [Validators.required]),
      tradingBots: new FormControl(false, [Validators.required]),
      ante: new FormControl(false, [Validators.required])
    })
  });

  private main = this.form.controls.main.controls;

  readonly primary = toSignal(this.form.controls.main.controls.primary.valueChanges,
                             { initialValue: null });
  readonly secondary = toSignal(this.form.controls.main.controls.secondary.valueChanges,
                             { initialValue: null })


  readonly primaryOptions = this.pcs.modes;
  readonly secondaryOptions = computed(() => this.pcs.MODE_RULES[this.primary() ?? 0]?.options(this.pcs) ?? []);
  readonly tertiaryRequired = computed(() => this.pcs.tertiaryKindFor(this.primary() ?? 0, this.secondary() ?? 0));


  constructor(private setServ: SetsService) {
    effect(() => setRequired(this.main.secondary, this.secondaryOptions().length > 0));
    effect(() => setRequired(this.main.tertiary, this.tertiaryRequired() !== null ));
  }


  onPrimaryChanged() { this.main.secondary.reset(null); this.main.tertiary.reset(null); }

  onSecondaryChanged() { this.main.tertiary.reset(null); }
  

  // IMPLEMENTATION OF SET POOL BLOCK

  chosen = toSignal(
    this.form.controls.main.valueChanges.pipe(
      switchMap((form: any) => {
        //console.log(form)
        if (form.tertiary?.members) return of(form.tertiary.members);

        if (form.tertiary?.year) {
          const { year, range, options } = form.tertiary;
          return this.setServ.listByDateRange(year, range, false, options);
        }

        let toEdit: Set[] = []

        return of(toEdit);
      })
    ),
    { initialValue: [] }
  );

  pool = linkedSignal(() => this.chosen());


  // END OF IMPLEMENTATION OF SET POOL BLOCK
}

function setRequired(c: AbstractControl, on: boolean) {
  on ? c.addValidators(Validators.required) : c.removeValidators(Validators.required);
  c.updateValueAndValidity({ emitEvent: false });
}