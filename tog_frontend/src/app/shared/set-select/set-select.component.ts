import { Component, inject, signal } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SetsService } from '../../core/services/cardServices/sets.service';
import { SetSelectService } from '../../core/services/cardServices/set-select.service';

@Component({
  selector: 'app-set-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, FormsModule],
  templateUrl: './set-select.component.html',
  styleUrl: './set-select.component.scss'
})
export class SetSelectComponent {

  constructor(public selectServ: SetSelectService){
  }
  
}
