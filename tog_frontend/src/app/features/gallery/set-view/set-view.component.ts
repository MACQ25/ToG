import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { SetSelectComponent } from '../../../shared/set-select/set-select.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CardsService } from '../../../core/services/cardServices/cards.service';
import { Form, FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-set-view',
  standalone: false,
  templateUrl: './set-view.component.html',
  styleUrl: './set-view.component.scss',
})
export class SetViewComponent {

  private fb = inject(FormBuilder)
  private destroyRef = inject(DestroyRef);


  galleryControls = this.fb.group({
    setSelected: new FormControl(),
    treatment: new FormControl(),
  });  
  

  constructor(public cardsServ: CardsService){
    this.galleryControls.controls.setSelected.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(value => {
        if (value) {
          this.cardsServ.fetchSetGallery(value.code);
        } else{
            this.cardsServ.cardsBase.set([]);
            this.cardsServ.collectionFilter.set('');
        }
      }
    );

    this.galleryControls.controls.treatment.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(value => {
        this.cardsServ.collectionFilter.update(() => value)
      }
    );


  }


  get setData(){
    return this.galleryControls.controls.setSelected.value
  }
}
