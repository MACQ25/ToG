import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { SetSelectComponent } from '../../shared/set-select/set-select.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    SetSelectComponent,
  ]
})
export class GalleryModule { }
