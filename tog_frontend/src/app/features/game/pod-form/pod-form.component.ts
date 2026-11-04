import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import * as _moment from 'moment';

// tslint:disable-next-line:no-duplicate-imports
import { PodFormService } from '../../../core/services/gameServices/pod-form.service';





@Component({
  selector: 'app-pod-form',
  standalone: false,
  templateUrl: './pod-form.component.html',
  styleUrl: './pod-form.component.scss',
  providers: [
    PodFormService
  ]
})
export class PodFormComponent {

  svc = inject(PodFormService);
  form = this.svc.form;
 
  /*

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

  */


  onSubmit(){
    console.log(this.form ) //this.pool()
  }

}
