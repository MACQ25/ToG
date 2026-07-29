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
import { GameReturnButtonComponent } from '../../shared/game-return-button/game-return-button.component';


@NgModule({
  declarations: [SelectComponent, SelectRouteToggleComponent, JoinComponent, CreateComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    GameReturnButtonComponent
  ]
})
export class GameModule { }
