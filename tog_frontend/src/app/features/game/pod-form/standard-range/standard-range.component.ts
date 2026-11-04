import { Component, forwardRef, inject, signal, ViewEncapsulation } from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DateFilterFn, MatCalendarCellClassFunction, MatDatepicker } from '@angular/material/datepicker';
import { PodConfigService } from '../../../../core/services/gameServices/pod-config.service';
import { AdvancedStndOptions, StandardOptions, Tertiary } from '../../../../core/services/gameServices/pod-config.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  selector: 'app-standard-range',
  standalone: false,
  templateUrl: './standard-range.component.html',
  styleUrl: './standard-range.component.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StandardRangeComponent), multi: true },
    provideMomentDateAdapter(MY_FORMATS),
  ]
})
export class StandardRangeComponent implements ControlValueAccessor {

  private fb = inject(FormBuilder)
  private pcs = inject(PodConfigService)

  private onChange: (v: Tertiary | null) => void = () => {};
  onTouched: () => void = () => {};

  get t2Ranges() { return this.pcs.t2 }
  get rangeDisplay() { return this.pcs.t2[this.inner.controls.range.value ?? 0].label  }

  readonly minDate: Moment = moment({ year: 1995, month: 8, day: 5 });
  readonly maxDate: Moment = moment().endOf('year');

  /*
  dateFilter = (d: Moment | null): boolean =>  {
      if(d !== null){
        return this.pcs.checkRelease(d.year().toString(), (d.month() + 1).toString(), d.date());
      }
      else return false
  };
  */

  inner = this.fb.group({
    date: new FormControl(null as Moment | null, Validators.required),
    range: new FormControl(null as number | null, Validators.required),
    adv: new FormGroup({
      displayRotated: new FormControl(false),
      csBehavior: new FormControl(1),
      rDate: new FormControl(1),
      allowMasters: new FormControl(false)
    })
  });

  advanced = this.inner.controls.adv;

  showAdv = signal<boolean>(false)

  constructor() {
    this.inner.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => {
      this.onChange(
        this.inner.valid
          ? { kind: 'standard', range: v.range!, year: v.date!, options: v.adv as AdvancedStndOptions }
          : null  // incomplete = no value, so the parent's "required" fails correctly
      );
    });
  }


  setYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();
    this.inner.controls.date.setValue(normalizedYear.clone());
    this.onTouched();
  }
  
  writeValue(v: any): void {
    if (v?.kind === 'standard') {
      this.inner.patchValue(
        { range: v.range, date: moment({ year: v, month: 9 }), adv: v.options },
        { emitEvent: false }   // don't echo it straight back to the parent
      );
    } else {
      this.inner.reset(undefined, { emitEvent: false });
    }
  }
  
  registerOnChange(fn: (v: Tertiary | null) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(disabled: boolean) {
    disabled ? this.inner.disable({ emitEvent: false }) : this.inner.enable({ emitEvent: false });
  }

}
