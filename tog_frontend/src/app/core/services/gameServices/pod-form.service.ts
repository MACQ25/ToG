import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SetsService } from '../cardServices/sets.service';
import { PodConfigService } from './pod-config.service';
import { startWith, switchMap, of, distinctUntilChanged } from 'rxjs';
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

  progressionExtras = new FormControl(null as boolean | null)

  readonly primary = toSignal(this.main.primary.valueChanges, { initialValue: null });
  readonly secondary = toSignal(this.main.secondary.valueChanges, { initialValue: null });
  readonly tertiary = toSignal(this.main.tertiary.valueChanges, { initialValue: null });
  readonly extrasMisc = toSignal(this.progressionExtras.valueChanges, { initialValue: null });

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

  private readonly request = computed(() => {
    let s = this.secondary()
    if (this.tertiary()?.kind === 'block') return this.tertiary();
    if (this.tertiary()?.kind === 'standard') return this.tertiary();
    if (this.primary() === 1 && this.secondary()) return { kind: 'progression', secondary: s, extras: this.extrasMisc() } as const;
    return { kind: 'empty' } as const;
  });

  blockName = signal<string>('');

  chosen = toSignal(
    toObservable(this.request).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((r: any) => {
        switch (r.kind) {
          case 'block':
            this.blockName.set(r.name);
            return of(r.members as Set[]);
          case 'standard': return this.setServ.listByStandardRotation(r.year, r.range, r.options);
          case 'progression': return this.setServ.listProgressionSet(r.secondary, r.extras);
          default:     
            return of([] as Set[]);
        }
      })
    ),
    { initialValue: [] as Set[] }
  );


  pool = linkedSignal(() => this.chosen());


  // END OF IMPLEMENTATION OF SET POOL BLOCK
}

function setRequired(c: AbstractControl, on: boolean) {
  on ? c.addValidators(Validators.required) : c.removeValidators(Validators.required);
  c.updateValueAndValidity({ emitEvent: false });
}