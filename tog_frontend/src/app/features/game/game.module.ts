import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { SelectComponent } from './select/select.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SelectRouteToggleComponent } from './select-route-toggle/select-route-toggle.component';
import { JoinComponent } from './join/join.component';
import { CreateComponent } from './create/create.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { SetSelectComponent } from '../../shared/set-select/set-select.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [SelectComponent, SelectRouteToggleComponent, JoinComponent, CreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GameRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatTooltipModule,
    SetSelectComponent
  ]
})
export class GameModule { }
