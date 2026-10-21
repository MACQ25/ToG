import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PodConfigService, verboseOption } from '../../../core/services/gameServices/pod-config.service';
import { SetsService } from '../../../core/services/cardServices/sets.service';
import { Observable, startWith, switchMap } from 'rxjs';
import {MatDatepicker} from '@angular/material/datepicker';
import { Set } from '../../../core/interfaces/set';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';


const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
    providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ]
})
export class CreateComponent {
  
  private fb = inject(FormBuilder)

  form = this.fb.group({
    main: new FormGroup({
      primary: new FormControl(null as number | null, [Validators.required]),
      secondary: new FormControl(null as number | null,),
      tertiary: new FormControl(),
    }),
    cardPool: new FormControl(1, [Validators.required]),
    exchange: new FormGroup({
      tradingPlayers: new FormControl(false, [Validators.required]),
      tradingBots: new FormControl(false, [Validators.required]),
      ante: new FormControl(false, [Validators.required])
    })
  });

  // Start of variables for the main select row

  modes: verboseOption[];
  secondaryAssociation!: any[];

  subSelectFlag1 = signal<number>(0);
  subSelectFlag2 = signal<number>(0);


  // End of variables for the main select row


  constructor(private pcs: PodConfigService, private setServ: SetsService) {
    
    this.modes = pcs.modes
    
    const MC = this.form.controls.main.controls

    const mode = MC.primary
    const secondary = MC.secondary;
    const tertiary = MC.tertiary;

    MC.primary.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((mode: null | number) => {

      this.subSelectFlag1.update(() => { return Number.isInteger(mode) ? mode as number : 0 } )


      if (this.subSelectFlag1() > 0) {
        this.setAssociations(mode) ? secondary.addValidators(Validators.required) : secondary.removeValidators(Validators.required);
      } else {
        secondary.removeValidators(Validators.required);
      }

      secondary.reset(null);
      secondary.updateValueAndValidity();
    });

    MC.secondary.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(secondary => {
      let modeVal = mode.value
    
      this.subSelectFlag2.update(() => { return modeVal! + (secondary || 0) } )

      if (this.subSelectFlag2() >= 6) {
        tertiary.addValidators(Validators.required);
      } else {
        tertiary.removeValidators(Validators.required);
      }
      
      tertiary.reset(null);
      tertiary.updateValueAndValidity()
    });
  }


  private setAssociations(selection: number | null) : boolean{
    if (!selection) this.secondaryAssociation = [];
    else {
      switch(selection){
        case 1:
          this.secondaryAssociation = this.pcs.progression
          return true
        case 2:
          this.secondaryAssociation = []
          return true
        case 3:          
          this.secondaryAssociation = this.pcs.constructed
          return true
      }
    }
    return false

  }

  get selectedSecondary() {
    const v = this.form.controls.main.controls.secondary.value;
    return this.secondaryAssociation.find(s => s.value === v);
  }


  // START OF IMPLEMENTATION FOR STANDARD
  
  readonly range = new FormControl(Validators.required);

  get t2Ranges() { return this.pcs.t2 }
  
  readonly date = new FormControl(moment());

  readonly minDate = new Date(95, 0, 1);
  readonly maxDate = new Date(moment().year(), 11, 31);


  setYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.year(normalizedYear.year());    
    this.date.setValue(ctrlValue);
    this.date.markAsDirty()
    this.formSaveCompound()
  }


  formSaveCompound(){
    if (this.range.dirty && this.date.dirty && this.range.valid){
      const tert = this.form.controls.main.controls.tertiary

      const dCtrl: Moment = this.date.value!

      const stnd = {
        range: this.range.value,
        year: dCtrl.year()
      }

      tert.setValue(stnd)
      tert.markAsDirty();
    }
  }

  // END OF IMPLEMENTATION OF FUNCTIONS NEEDED TO IMPLEMENT STANDARD


  // IMPLEMENTATION OF SET POOL BLOCK

  poolFlag = computed(() => {
    return this.subSelectFlag1() === 4 || (this.subSelectFlag2() >= 6)
  })

  $poolPredef = toSignal(this.form.controls.main.valueChanges)

  chosen = computed(() => {
    const form = this.$poolPredef()!;
    if(form.tertiary?.members) return form.tertiary?.members

    if(form.tertiary?.year) {
      const dateObj = form.tertiary
      this.setServ.listByDateRange(dateObj.year, dateObj.range, false).subscribe(
        (res: any) => console.log(res)
      )
    }

    return []
  })


  // END OF IMPLEMENTATION OF SET POOL BLOCK


  // SINGLE FUNCTION TO REPRESENT THE RADIO
  poolChange(val: boolean = true){
    val ? 
      this.form.controls.exchange.enable() : this.form.controls.exchange.disable()
  }


  // START OF FUNCTIONS FOR EXCHANGE OPTIONS

  private exchangeValue = toSignal(
    this.form.controls.exchange.valueChanges.pipe(
      startWith(this.form.controls.exchange.value)
    ),
    { initialValue: this.form.controls.exchange.value }
  );

  readonly allChecked = computed(() =>
    Object.values(this.exchangeValue()).every(Boolean)
  );

  readonly tradingPartial = computed(() => {
    const values = Object.values(this.exchangeValue());
    return values.some(Boolean) && !values.every(Boolean);
  });


  update(checked: boolean) {
    this.form.controls.exchange.setValue({
      tradingPlayers: checked,
      tradingBots: checked,
      ante: checked,
    });
  }

  // END OF FUNCTIONS FOR EXCHANGE OPTIONS

  onSubmit(){
    console.log(this.subSelectFlag1(), this.subSelectFlag2(), this.form)
  }
}
