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

  onSubmit(){
    console.log(this.form, this.svc.pool() ) //this.pool()
  }

}
