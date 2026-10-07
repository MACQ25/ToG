import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryRoutingModule } from './gallery-routing.module';
import { SetSelectComponent } from '../../shared/set-select/set-select.component';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../shared/card/card.component';
import { SetViewComponent } from './set-view/set-view.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [SetViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GalleryRoutingModule,
    SetSelectComponent,
    CardComponent,
    SetSelectComponent,
    MatIconModule,
    MatFormFieldModule,  
    MatInputModule, 
    FormsModule,
    MatSelectModule
  ]
})
export class GalleryModule { }
