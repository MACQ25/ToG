import { Component, computed, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import { PodConfigService } from '../../../../core/services/gameServices/pod-config.service';

@Component({
  selector: 'app-secondary-configs',
  standalone: false,
  templateUrl: './secondary-configs.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SecondaryConfigsComponent),
    multi: true
  }],
  styleUrl: './secondary-configs.component.scss',
})
export class SecondaryConfigsComponent implements ControlValueAccessor{

  private fb = inject(FormBuilder);
  private pcs = inject(PodConfigService);

  private onChange: (v: any | null) => void = () => {};
  onTouched: () => void = () => {};

  configs = this.fb.group({
    cardPool: new FormControl(1, [Validators.required]),
    exchange: new FormGroup({
      tradingPlayers: new FormControl(false, [Validators.required]),
      tradingBots: new FormControl(false, [Validators.required]),
      ante: new FormControl(false, [Validators.required])
    })
  });

  constructor() {
    this.configs.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => {
      console.log(this.configs.valid)
      this.onChange(
        this.configs.valid
          ? { value: 'henlo'}
          : null  // incomplete = no value, so the parent's "required" fails correctly
      );
    });
  }


  // SINGLE FUNCTION TO REPRESENT THE RADIO

  poolChange(val: boolean = true){
    val ? 
      this.configs.controls.exchange.enable() : this.configs.controls.exchange.disable()
  }


  // START OF FUNCTIONS FOR EXCHANGE OPTIONS

  private exchangeValue = toSignal(
    this.configs.controls.exchange.valueChanges.pipe(
      startWith(this.configs.controls.exchange.value)
    ),
    { initialValue: this.configs.controls.exchange.value }
  );

  readonly allChecked = computed(() =>
    Object.values(this.exchangeValue()).every(Boolean)
  );

  readonly tradingPartial = computed(() => {
    const values = Object.values(this.exchangeValue());
    return values.some(Boolean) && !values.every(Boolean);
  });


  update(checked: boolean) {
    this.configs.controls.exchange.setValue({
      tradingPlayers: checked,
      tradingBots: checked,
      ante: checked,
    });
  }

  // END OF FUNCTIONS FOR EXCHANGE OPTIONS


  writeValue(obj: any): void {
    //this.configs.reset(undefined, { emitEvent: false });
  }


  registerOnChange(fn: (v: any | null) => void): void  { this.onChange = fn; }

  registerOnTouched(fn: () => void) { this.onTouched = fn; }

  setDisabledState(disabled: boolean) {
    disabled ? this.configs.disable({ emitEvent: false }) : this.configs.enable({ emitEvent: false });
  }

}
