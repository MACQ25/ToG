import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetViewComponent } from './set-view/set-view.component';

const routes: Routes = [
  {
    path: '',
    component: SetViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
