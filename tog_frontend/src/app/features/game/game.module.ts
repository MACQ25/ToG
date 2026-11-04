import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { SelectComponent } from './select/select.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SelectRouteToggleComponent } from './select/select-route-toggle/select-route-toggle.component';
import { JoinComponent } from './select/join/join.component';
import { CreateComponent } from './select/create/create.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SetIconBoxComponent } from '../../shared/set-icon-box/set-icon-box.component';
import { SetSelectComponent } from '../../shared/set-select/set-select.component';
import { PodFormComponent } from './pod-form/pod-form.component';
import { StandardRangeComponent } from './pod-form/standard-range/standard-range.component';


@NgModule({
  declarations: [SelectComponent, SelectRouteToggleComponent, JoinComponent, CreateComponent, PodFormComponent, StandardRangeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GameRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    SetIconBoxComponent,
    SetSelectComponent,
    ReactiveFormsModule, 
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule
  ]
})
export class GameModule { }
