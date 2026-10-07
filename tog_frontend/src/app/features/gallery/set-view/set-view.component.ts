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
    this.galleryControls.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        console.log('Form changed:', value, value.setSelected)
        this.setSelection(value.setSelected ? true : false, value.setSelected?.code)
      }
    );
  }


  setSelection(selected: boolean, code: string = ""){
    if (selected) {
      this.cardsServ.fetchSetGallery(code);
    } else{
        this.cardsServ.cardsBase.set([]);
        this.cardsServ.collectionFilter.set('');
    }
  }

  get setData(){
    return this.galleryControls.controls.setSelected.value
  }
}
